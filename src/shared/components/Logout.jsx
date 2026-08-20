import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/util";

export const Logout = () => {
    const navigate = useNavigate();
  return (
    <div>
        <button onClick={() => {
            logout();
            navigate("/signin");
        }} >Logout</button>
    </div>
  )
}
