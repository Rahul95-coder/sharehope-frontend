import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, X, AlertCircle, Calendar, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { toLocalInputValue, hoursFromNow } from '../../utils/datetime';
export const CreateDonationPage = () => {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('COOKED_FOOD');
    const [foodType, setFoodType] = useState('VEG');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(50);
    const [unit, setUnit] = useState('KG');
    // Dates: Expiry default 4 hours from now
    const defaultExpiry = toLocalInputValue(hoursFromNow(4));
    const defaultDeadline = toLocalInputValue(hoursFromNow(2));
    const [expiryDateTime, setExpiryDateTime] = useState(defaultExpiry);
    const [pickupDeadline, setPickupDeadline] = useState(defaultDeadline);
    // Storage
    const [storageCondition, setStorageCondition] = useState('ROOM_TEMPERATURE');
    const [temperatureGuideline, setTemperatureGuideline] = useState('Keep warm above 60°C or consume within 4 hours');
    // Address pre-filled
    const [addressLine, setAddressLine] = useState(user?.address?.addressLine || '');
    const [city, setCity] = useState(user?.address?.city || 'Ahmedabad');
    const [state, setState] = useState(user?.address?.state || 'Gujarat');
    const [pincode, setPincode] = useState(user?.address?.pincode || '380054');
    // Images
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Unverified donor restriction check
    if (user?.status !== 'VERIFIED') {
        return (<div className="bg-white rounded-3xl p-8 border border-surface-border text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8"/>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Verification Required</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your organization account is currently <strong className="text-amber-700">{user?.status || 'PENDING'}</strong>. To guarantee food safety and trust for recipient NGOs, only verified donors can publish active surplus food.
        </p>
        <button onClick={() => navigate('/donor/profile')} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm">
          View Profile & Upload Documents
        </button>
      </div>);
    }
    // Estimated meals calculation
    const getEstimatedMeals = () => {
        if (!quantity || Number(quantity) <= 0)
            return 0;
        const q = Number(quantity);
        if (unit === 'KG')
            return Math.round(q * 4);
        if (unit === 'PORTIONS')
            return q;
        if (unit === 'GRAMS')
            return Math.round((q / 1000) * 4);
        return Math.round(q * 1.5);
    };
    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray].slice(0, 5));
            const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews].slice(0, 5));
        }
    };
    const removeImage = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!quantity || Number(quantity) <= 0) {
            setErrorMessage('Please enter a valid surplus quantity.');
            return;
        }
        if (new Date(expiryDateTime) <= new Date()) {
            setErrorMessage('Expiry date and time must be in the future.');
            return;
        }
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('foodType', foodType);
            formData.append('description', description);
            formData.append('quantity', String(quantity));
            formData.append('unit', unit);
            formData.append('expiryDateTime', new Date(expiryDateTime).toISOString());
            if (pickupDeadline) {
                formData.append('pickupDeadline', new Date(pickupDeadline).toISOString());
            }
            formData.append('storageCondition', storageCondition);
            formData.append('temperatureGuideline', temperatureGuideline);
            formData.append('pickupAddress[addressLine]', addressLine);
            formData.append('pickupAddress[city]', city);
            formData.append('pickupAddress[state]', state);
            formData.append('pickupAddress[pincode]', pincode);
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });
            const res = await api.post('/donations', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data?.success) {
                success('Surplus food batch successfully posted! Nearby NGOs have been alerted.');
                navigate('/donor/donations');
            }
        }
        catch (err) {
            const msg = err.response?.data?.message || 'Failed to publish surplus donation.';
            setErrorMessage(msg);
            toastError(msg);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Publish Surplus Food Batch</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            List excess buffet, bakery, or packaged inventory for instant claim by verified NGOs
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5"/>
          <span>FSSAI Compliant Listing</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm">
        {errorMessage && (<div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5"/>
            <span>{errorMessage}</span>
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Surplus Item Title *
              </label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wedding Buffet Dal-Rice & Paneer Sabzi" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                <option value="COOKED_FOOD">Cooked Food (Buffet / Banquet)</option>
                <option value="PACKAGED_FOOD">Packaged / Canned Food</option>
                <option value="BAKERY">Bakery (Breads, Pav, Buns)</option>
                <option value="GROCERIES">Dry Groceries / Grains</option>
                <option value="FRUITS">Fresh Fruits</option>
                <option value="VEGETABLES">Fresh Vegetables</option>
                <option value="DAIRY">Dairy Products (Paneer, Milk)</option>
                <option value="ESSENTIALS">Essentials / Hygiene</option>
                <option value="CLOTHING">Clean Linens / Clothes</option>
                <option value="OTHER">Other Surplus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Food Classification *
              </label>
              <select value={foodType} onChange={(e) => setFoodType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                <option value="VEG">Vegetarian (VEG)</option>
                <option value="NONVEG">Non-Vegetarian (NON-VEG)</option>
                <option value="NOT_APPLICABLE">Not Applicable (Groceries / Linens)</option>
              </select>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Quantity *
              </label>
              <input type="number" step="0.5" min="0.5" required value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} placeholder="50" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"/>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Unit *
              </label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium">
                <option value="KG">Kilograms (KG)</option>
                <option value="PORTIONS">Portions / Thalis</option>
                <option value="GRAMS">Grams</option>
                <option value="LITERS">Liters</option>
                <option value="PACKETS">Packets</option>
                <option value="BOXES">Boxes</option>
                <option value="PIECES">Pieces</option>
              </select>
            </div>

            {/* Impact Calculation Preview */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-900">Estimated Meals:</span>
              <span className="font-extrabold text-primary text-base">~{getEstimatedMeals()} meals</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Ingredients Notes
            </label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Contains steamed basmati rice, dal tadka, mixed vegetable sabzi, and gulab jamun. Prepared at 9:00 AM." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"/>
          </div>

          {/* Expiry & Pickup Deadlines */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary"/>
              <span>Time-Critical Pickup Window</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Absolute Expiry Date & Time *
                </label>
                <input type="datetime-local" required value={expiryDateTime} onChange={(e) => setExpiryDateTime(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"/>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Donations are automatically marked EXPIRED if not collected before this time.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Pickup Deadline
                </label>
                <input type="datetime-local" value={pickupDeadline} onChange={(e) => setPickupDeadline(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"/>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recommended arrival time for NGO vehicle dispatch.
                </span>
              </div>
            </div>
          </div>

          {/* Storage Conditions */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Storage & Handling Requirements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Storage Condition</label>
                <select value={storageCondition} onChange={(e) => setStorageCondition(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                  <option value="ROOM_TEMPERATURE">Room Temperature</option>
                  <option value="REFRIGERATED">Refrigerated (2°C - 8°C)</option>
                  <option value="FROZEN">Frozen (-18°C)</option>
                  <option value="DRY_STORAGE">Dry Storage (Cool & Dry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Temperature / Safety Note</label>
                <input type="text" value={temperatureGuideline} onChange={(e) => setTemperatureGuideline(e.target.value)} placeholder="e.g. Keep chilled in insulated container" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
              </div>
            </div>
          </div>

          {/* Pickup Address */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary"/>
              <span>Pickup Address</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Address / Landmark</label>
                <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Rear Kitchen Gate, Hotel Grand, SG Highway" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pincode</label>
                  <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"/>
                </div>
              </div>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-800 mb-2">Photos of Surplus Food (Up to 5)</h4>
            <p className="text-xs text-slate-500 mb-4">
              Real photos help recipient NGOs assess packaging, freshness, and necessary transport vessels.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              {previewUrls.map((url, index) => (<div key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img src={url} alt="Preview" className="w-full h-full object-cover"/>
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-rose-600 transition">
                    <X className="w-3.5 h-3.5"/>
                  </button>
                </div>))}

              {previewUrls.length < 5 && (<label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-slate-100">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary"/>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">Add Photo</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} className="hidden"/>
                </label>)}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-4">
            <button type="button" onClick={() => navigate('/donor/donations')} className="px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 text-sm hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition flex items-center justify-center gap-2 disabled:opacity-50">
              <PlusCircle className="w-4 h-4"/>
              <span>{isSubmitting ? 'Publishing Batch...' : 'Publish Surplus Batch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);
};
