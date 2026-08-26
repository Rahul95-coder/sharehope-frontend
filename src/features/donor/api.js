import { api } from "../../lib/axios"


export const createDonationApi = async (formdata) => {
    const response = await api.post("/donation",formdata);
    return response.data;
}

export const getAllDonationApi = async () => {
    const response = await api.get("/donation");
    return response.data;
}