import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
             if (window.location.pathname !== "/auth") {
                window.location.href = "/auth";
            }
        }

        return Promise.reject(error);
    }
);