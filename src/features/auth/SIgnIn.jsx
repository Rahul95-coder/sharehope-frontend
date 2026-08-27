import { useState } from "react";
import { useSignIn } from "./hooks";
import { Loader } from "lucide-react";

export const SignIn = () => {
   

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const signInMutation = useSignIn();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }

        signInMutation.mutate(formData);
    };

    return (
        <div className="card w-full overflow-hidden border-primary/10 bg-white p-5 sm:p-7 lg:p-8">
            {/* Brand accent */}
            <div className="mb-6 flex justify-center sm:mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary shadow-soft">
                    <span className="text-xl font-bold">S</span>
                </div>
            </div>

            {/* Header */}
            <div className="mb-7 text-center sm:mb-8">
                <h1 className="font-lora text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                    Welcome Back
                </h1>

                <p className="text-body mt-2">
                    Sign in to continue to ShareHope
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="label">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="input"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="label">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="input"
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="animate-fade-in rounded-md border border-danger/20 bg-danger-light px-3 py-2 text-sm text-danger">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={signInMutation.isPending}
                    className="btn-primary focus-ring w-full"
                >
                    {signInMutation.isPending ? (
                        <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

        </div>
    );
};