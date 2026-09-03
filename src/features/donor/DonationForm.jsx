import { useState } from "react";
import { Loader } from "lucide-react";
import { useCreateDonation } from "./hooks";
import { useAuthStore } from "../auth/authStore";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#dfe7e1] bg-[#f9fbf9] px-3.5 py-2.5 text-sm text-[#122718] outline-none transition focus:border-[#1d7b4b] focus:bg-white focus:ring-2 focus:ring-[#dff7e8]";

const getLocalDateTimeValue = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const validateExpiryDateTime = (value) => {
  if (!value) return "";

  const chosen = new Date(value);

  if (Number.isNaN(chosen.getTime())) {
    return "Please select a valid expiry date and time.";
  }

  if (chosen < new Date()) {
    return "Expiry date and time must be today or in the future.";
  }

  return "";
};

const DonationForm = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    qty: 0,
    unit: "",
    foodType: "VEG",
    expiryDateTime: "",
  });
  const [expiryError, setExpiryError] = useState("");

  const user = useAuthStore((state) => state.user); // line khabar padi? thodik thodik, apde login user na data ek store ma sachvine rakhay jenu name useAuthSotre che
  // ema (state) etle data , etle data mathi user no object apo je apde user variable ma store karyo, pachi emathi userId kadhi lidhi , have? store karaviyu vieblme ma right ne ha
  const createDonationMutation = useCreateDonation(user?.userId);

  const handleExpiryChange = (value) => {
    setForm((prev) => ({ ...prev, expiryDateTime: value }));
    setExpiryError(validateExpiryDateTime(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateExpiryDateTime(form.expiryDateTime);
    if (validationError) {
      setExpiryError(validationError);
      return;
    }

    createDonationMutation.mutate(form, {
      onSuccess: () => {
        setForm({
          title: "",
          category: "",
          description: "",
          qty: 0,
          unit: "",
          foodType: "VEG",
          expiryDateTime: "",
        });
        setExpiryError("");
      },
    });
  };

  return (
    <div className="rounded-3xl border border-[#e3ebdf] bg-white p-5 shadow-[0_12px_35px_rgba(11,46,22,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#607166]">
            Donation
          </p>
          <h3 className="mt-1 text-2xl font-bold text-[#14261a]">
            Create a donation
          </h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-[#2a3d32]">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className={inputClass}
            placeholder="Fresh rice packets"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="text-sm font-medium text-[#2a3d32]"
            >
              Category
            </label>

            <select
              id="category"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="COOKED_FOOD">Cooked Food</option>
              <option value="PACKAGED_FOOD">Packaged Food</option>
              <option value="GROCERIES">Groceries</option>
              <option value="FRUITS">Fruits</option>
              <option value="VEGETABLES">Vegetables</option>
              <option value="BAKERY">Bakery</option>
              <option value="DAIRY">Dairy</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="qty" className="text-sm font-medium text-[#2a3d32]">
              Quantity
            </label>
            <input
              type="number"
              id="qty"
              value={form.qty}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, qty: e.target.value }))
              }
              className={inputClass}
              min="1"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-[#2a3d32]"
          >
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className={`${inputClass} min-h-28 resize-none`}
            placeholder="Write about the food being donated..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="unit"
              className="text-sm font-medium text-[#2a3d32]"
            >
              Unit
            </label>
            <input
              type="text"
              id="unit"
              value={form.unit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, unit: e.target.value }))
              }
              className={inputClass}
              placeholder="Packets"
            />
          </div>

          <div>
            <label
              htmlFor="foodType"
              className="text-sm font-medium text-[#2a3d32]"
            >
              Food type
            </label>
            <select
              id="foodType"
              value={form.foodType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, foodType: e.target.value }))
              }
              className={inputClass}
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non Veg</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="expiryDateTime"
            className="text-sm font-medium text-[#2a3d32]"
          >
            Expiry date & time
          </label>
          <input
            type="datetime-local"
            id="expiryDateTime"
            value={form.expiryDateTime}
            min={getLocalDateTimeValue(new Date())}
            onChange={(e) => handleExpiryChange(e.target.value)}
            className={inputClass}
          />
          {expiryError && (
            <p className="mt-2 text-xs text-danger">{expiryError}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={createDonationMutation.isPending}
            className="btn-primary w-full justify-center"
          >
            {createDonationMutation.isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Create donation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
