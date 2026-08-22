import { useNavigate } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks";

export const Logout = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    return (
    <div>
        <button onClick={() => {
            logout.mutate();
            navigate("/auth");
        }} >Logout</button>
    </div>
  )
}
