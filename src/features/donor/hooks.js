import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDonationApi, getAllDonationApi } from "./api";
import { toast } from "react-toastify";
import { queryKeys } from "../../lib/react-query/queryKeys";

export const useCreateDonation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDonationApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.donation(userId) }); // aa method che ene ek object pass karvano eni andar key value pair (property) donation: (userId: any) => any[] ane userid devani che okay pn haji apdi pase te nathi ,, aje line che te em ke che jo success thay crete donation ma to je querykey api che ene invalidate karo mean expire karo etle ee farithi refetch kari nakhse , aa khabr padi?okay to have ek donation banay auto matic new data update thay gyo hashe
      toast.success(response.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message || "Failed to create donation");
    },
  });
};

export const useGetAllDonation = (userId) => {
  return useQuery({
    queryFn: getAllDonationApi,
    queryKey: queryKeys.donation(userId),
  });
};
///query key samjani? n
// hooks ni file seprate kari shake? hook ne file ma badhu query lakhvani che te hamna batave ee
