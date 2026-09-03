import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks";

export const Logout = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <button
      type="button"
      onClick={() => {
        logout.mutate();
        navigate("/auth");
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-500/20 hover:text-red-100 hover:border-red-400/30 hover:shadow-[0_8px_20px_rgba(239,68,68,0.18)]"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
};
