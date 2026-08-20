import  { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:8080/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            // Store JWT token
            //localStorage.setItem("token", data.token);

            // Optional: store user information
            if (data) {
                localStorage.setItem("user", JSON.stringify(data));
            }

            // Login successful
            if (data.role === "admin") {
                navigate("/dashboard-admin");
            } else if (data.role === "ngo") {
                navigate("/dashboard-ngo");
            } else if (data.role === "donor") {
                navigate("/dashboard-donor");
            } else {
                navigate("/*")
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Sign In
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Login to your account
                </p>

                {error && (
                    <div className="mb-4 rounded-md bg-red-100 text-red-700 px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                <p className="text-center text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Sign Up
                    </button>
                </p>

            </div>
        </div>
    );
};

