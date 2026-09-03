import { api } from "../../lib/axios";

export const createDonationApi = async (formdata) => {
  const response = await api.post("/donation", formdata);
  return response.data;
};

export const getAllDonationApi = async () => {
  // aa ee api che
  console.log(
    "jay ne potan records auto matice refetch karva che jyare jay new donation banave",
  );
  const response = await api.get("/donation");
  return response.data;
};
    