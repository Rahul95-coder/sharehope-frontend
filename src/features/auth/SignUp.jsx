import { useState } from "react";

import { useSignup } from "./hooks";

const SignUp = ({setTab}) => {
    const signUpMutation = useSignup();

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        password: "",
        contactPersonName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        donorType: "",
        registrationNumber: "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            e.target.value = "";
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert("PDF must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            // DONOR does not need registration number
            if (formData.role === "DONOR" && key === "registrationNumber") {
                data.append(key, "");
                return;
            }

            // NGO does not need donor type
            if (formData.role === "NGO" && key === "donorType") {
                data.append(key, "");
                return;
            }

            data.append(key, value);
        });

        // Only NGO requires document
        if (formData.role === "NGO") {
            if (!file) {
                alert("Please select a PDF document.");
                return;
            }

            data.append("document", file);
        }

        signUpMutation.mutate(data);
    };

    return (
        <div className="card w-full overflow-hidden border-primary/10 bg-white p-5 sm:p-7 lg:p-8">
            {/* Header */}
            <div className="mb-7 text-center sm:mb-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary shadow-soft">
                    <span className="text-xl font-bold">S</span>
                </div>

                <h1 className="font-lora text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                    Join ShareHope
                </h1>

                <p className="text-body mt-2">
                    Create your account and become part of the community
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                            1
                        </span>

                        <div>
                            <h2 className="font-lora text-base font-semibold text-foreground">
                                Basic Information
                            </h2>

                            <p className="text-xs text-muted">
                                Tell us a little about yourself
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="label">
                                DONOR / NGO Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                pattern="^[A-Za-z\s]+$"
                                title="Name should contain only letters and spaces."
                                className="input"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="label">
                                Role
                            </label>

                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="input"
                            >
                                <option value="">Select Role</option>
                                <option value="DONOR">Donor</option>
                                <option value="NGO">NGO</option>
                            </select>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                title="Enter a valid email address."
                                className="input"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="label">
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                maxLength="10"
                                title="Phone number must contain exactly 10 digits."
                                className="input"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                title="Password must be at least 8 characters."
                                className="input"
                            />
                        </div>

                        {/* Contact Person */}
                        <div>
                            <label htmlFor="contactPersonName" className="label">
                                Contact Person Name
                            </label>

                            <input
                                id="contactPersonName"
                                type="text"
                                name="contactPersonName"
                                value={formData.contactPersonName}
                                onChange={handleChange}
                                required
                                pattern="^[A-Za-z\s]+$"
                                title="Name should contain only letters and spaces."
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="border-t border-border-light pt-6">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                            2
                        </span>

                        <div>
                            <h2 className="font-lora text-base font-semibold text-foreground">
                                Address
                            </h2>

                            <p className="text-xs text-muted">
                                Where can we find you?
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Address */}
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="label">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="input min-h-24 resize-y"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label htmlFor="city" className="label">
                                City
                            </label>

                            <input
                                id="city"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                pattern="^[A-Za-z\s]+$"
                                title="City should contain only letters and spaces."
                                className="input"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label htmlFor="state" className="label">
                                State
                            </label>

                            <input
                                id="state"
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                pattern="^[A-Za-z\s]+$"
                                title="State should contain only letters and spaces."
                                className="input"
                            />
                        </div>

                        {/* Pincode */}
                        <div className="sm:max-w-xs">
                            <label htmlFor="pincode" className="label">
                                Pincode
                            </label>

                            <input
                                id="pincode"
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength="6"
                                title="Pincode must contain exactly 6 digits."
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {/* Donor / NGO Information */}
                <div className="border-t border-border-light pt-6">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                            3
                        </span>

                        <div>
                            <h2 className="font-lora text-base font-semibold text-foreground">
                                Additional Information
                            </h2>

                            <p className="text-xs text-muted">
                                Details specific to your selected role
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Donor Type */}
                        <div>
                            <label htmlFor="donorType" className="label">
                                Donor Type
                            </label>

                            <select
                                id="donorType"
                                name="donorType"
                                value={formData.donorType}
                                onChange={handleChange}
                                required={formData.role === "DONOR"}
                                disabled={formData.role === "NGO"}
                                className="input disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-light"
                            >
                                <option value="">Select Donor Type</option>
                                <option value="HOTEL">Hotel</option>
                                <option value="RESTAURANT">Restaurant</option>
                                <option value="CATERING">Catering</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        {/* Registration Number */}
                        <div>
                            <label
                                htmlFor="registrationNumber"
                                className="label"
                            >
                                Registration Number
                            </label>

                            <input
                                id="registrationNumber"
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                required={formData.role === "NGO"}
                                disabled={formData.role === "DONOR"}
                                className="input disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-light"
                            />
                        </div>

                        {/* Document */}
                        <div className="sm:col-span-2">
                            <label htmlFor="document" className="label">
                                Registration / Verification Document
                            </label>

                            <div className="rounded-lg border border-dashed border-primary/20 bg-primary-soft p-4 transition-ui hover:border-primary/40">
                                <input
                                    id="document"
                                    type="file"
                                    name="document"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    required={formData.role === "NGO"}
                                    disabled={formData.role === "DONOR"}
                                    className="block w-full cursor-pointer text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white file:transition-ui hover:file:bg-primary-dark disabled:cursor-not-allowed"
                                />

                                <small className="mt-2 block text-xs text-muted">
                                    PDF only, maximum 5 MB.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="border-t border-border-light pt-6">
                    <button
                        type="submit"
                        disabled={signUpMutation.isPending}
                        className="btn-primary focus-ring w-full"
                    >
                        {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="mt-3 text-center text-xs text-muted">
                        By creating an account, you agree to use ShareHope responsibly.
                    </p>
                </div>
            </form>

            
                <p>Already have an account ?</p>
                    <button type="button" onClick={() => 
                      setTab("signin")
                    }>Sign In</button>
        </div>
    );
};

export default SignUp;