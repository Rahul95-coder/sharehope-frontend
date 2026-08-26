import { useMutation, useQuery } from "@tanstack/react-query"
import { createDonationApi, getAllDonationApi } from "./api"
import { toast } from "react-toastify"
import { queryKeys } from "../../lib/react-query/queryKeys"


export const useCreateDonation = () => {
    return useMutation({
        mutationFn:createDonationApi,
        onSuccess:(response) => {
            toast.success(response.message)
        },
        onError:(error) => {
             console.log(error);
            toast.error(error.response.data.message || "Failed to create donation")
        }
    })
}


export const useGetAllDonation = (userId) => {
    return useQuery({
        queryFn:getAllDonationApi,
        queryKey:queryKeys.donation(userId)
    })
}