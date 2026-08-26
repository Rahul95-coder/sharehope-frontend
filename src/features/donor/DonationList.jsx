import { useAuthStore } from "../auth/authStore";
import { useGetAllDonation } from "./hooks"

const DonationList = () => {

    const user = useAuthStore((state) => state.user);
    console.log(user)

    const getAllDonation = useGetAllDonation(user.userId);
    console.log(getAllDonation.data)
    return (
    <div>DonationList
        {getAllDonation?.data?.donations?.map((d) => {

            return (
                
                    <div key={d._id}>

                    {d.title}
                    <br/>
                    </div>
            )
        })}
    </div>
  )
}

export default DonationList