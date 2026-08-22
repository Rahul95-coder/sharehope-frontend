import { SignIn } from "./SIgnIn";
import SignUp from "./SignUp";

const Auth = () => {
  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="container-app py-8 sm:py-12 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <SignIn />
          <SignUp />
        </div>
      </div>
    </main>
  );
};

export default Auth;