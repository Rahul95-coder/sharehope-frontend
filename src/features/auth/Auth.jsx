import { useState } from "react";

import { SignIn } from "./SIgnIn";
import SignUp from "./SignUp";

const Auth = () => {
    const [tab, setTab] = useState("signin");

    return (
      <main className="min-h-screen bg-surface-muted">
        {tab === "signin" && (
          <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full max-w-md">
              <SignIn  />
              <p
                onClick={() => setTab("signup")}
                className="mt-5 cursor-pointer text-center text-sm text-primary-dark"
              >
                Don't have an account?
                <span className="text-blue-600 hover:underline">Sign Up</span>
              </p>
            </div>
          </div>
        )}

        {tab === "signup" && (
          <div className="container-app py-8 sm:py-12 lg:py-16">
            <div className="mx-auto w-full max-w-5xl">
              <SignUp  />
              <p
                onClick={() => setTab("signin")}
                className="mt-5 cursor-pointer text-center text-sm text-primary-dark"
              >
                Already have an account?
                <span className="text-blue-600 hover:underline">Sign In</span>
              </p>
            </div>
          </div>
        )}
      </main>
    );
};

export default Auth;