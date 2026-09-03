import { useAuthStore } from "../auth/authStore";
import { useGetAllDonation } from "./hooks";

const formatDate = (value) => {
  if (!value) return "No expiry date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No expiry date";

  const today = new Date();
  if (date < today) {
    return "Expired";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const DonationList = () => {
  const user = useAuthStore((state) => state.user);
  const getAllDonation = useGetAllDonation(user?.userId);
  const donations = getAllDonation?.data?.donations || [];

  return (
    <div className="rounded-3xl border border-[#e3ebdf] bg-white p-3 sm:p-5 md:p-6">
      <div className="mb-4 sm:mb-5 flex flex-col gap-1 sm:gap-0">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.12em] text-[#607166]">
          My donations
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-[#14261a]">
          Recent activity
        </h3>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {donations.length ? (
          donations.map((d) => (
            <div
              key={d._id}
              className="rounded-2xl border border-border-light bg-[#f9fbf9] p-3 sm:p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base text-[#14261a]">
                    {d.title}
                  </p>
                  <p className="text-xs sm:text-sm text-[#607166]">
                    {d.category || "Food donation"}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-success-light px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-[#0f7a3a] whitespace-nowrap">
                  {d.food_type || d.foodType || "VEG"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                <div>
                  <p className="text-[#607166]">Qty</p>
                  <p className="font-medium text-[#14261a]">{d.qty ?? 0}</p>
                </div>
                <div>
                  <p className="text-[#607166]">Unit</p>
                  <p className="font-medium text-[#14261a]">{d.unit || "-"}</p>
                </div>
                <div>
                  <p className="text-[#607166]">Expiry</p>
                  <p className="font-medium text-[#14261a]">
                    {formatDate(d.expiry_datetime || d.expiryDateTime)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-[#fafcfb] p-4 sm:p-6 text-center text-xs sm:text-sm text-[#607166]">
            No donations yet. Add your first donation from the sidebar.
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationList;
