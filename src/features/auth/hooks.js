import { useMutation } from "@tanstack/react-query";
import { logOutApi, signInApi, signUpApi } from "./api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";

export const useSignIn = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: signInApi,
    onSuccess: (res) => {
      console.log(res);
      setUser(res.user);
      if (res.user.role === "ADMIN") {
        navigate("/dashboard-admin");
      } else if (res.user.role === "NGO") {
        navigate("/dashboard-ngo");
      } else if (res.user.role === "DONOR") {
        console.log(res.user.role);
        navigate("/dashboard-donor");
      } else {
        navigate("/*");
      }
      toast.success("Sign in successfull.");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message || "Invalid Credentials");
    },
  });
};

export const useSignup = (options = {}) => {
  return useMutation({
    mutationFn: signUpApi,
    onSuccess: (res, variables, context) => {
      console.log(res);
      toast.success("Sign up successfull.");
      options.onSuccess?.(res, variables, context);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message || "Failed to sign up");
    },
  });
};

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  return useMutation({
    mutationFn: logOutApi,
    onSuccess: (res) => {
      console.log(res);
      clearUser();
      toast.success("Logout successfull.");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message || "Failed to logout");
    },
  });
};
