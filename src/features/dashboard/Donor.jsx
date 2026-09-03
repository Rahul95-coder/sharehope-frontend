import { useState } from "react";
import {
  HandHeart,
  LayoutDashboard,
  ListChecks,
  Menu,
  PlusCircle,
  UserRound,
  X,
} from "lucide-react";
import DonationForm from "../donor/DonationForm";
import DonationList from "../donor/DonationList";
import { Logout } from "../../shared/components/Logout";
import { useAuthStore } from "../auth/authStore";

const navigation = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "new-donation", label: "New Donation", icon: PlusCircle },
  { key: "my-donations", label: "My Donations", icon: ListChecks },
  { key: "profile", label: "Profile", icon: UserRound },
];

export const Donor = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const renderContent = () => {
    if (activeTab === "new-donation") return <DonationForm />;
    if (activeTab === "my-donations") return <DonationList />;
    if (activeTab === "profile") {
      return (
        <div className="rounded-3xl border border-[#e3ebdf] bg-white p-6">
          <h3 className="text-xl font-semibold text-[#14261a]">
            Donor profile
          </h3>
          <p className="mt-2 text-sm text-[#607166]">
            Keep your contact and donation preferences updated so NGOs can
            respond faster.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <DonationForm />
        <DonationList />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f7f3] text-[#15261b]">
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/35 lg:hidden"
        />
      )}

      <div className="mx-auto flex min-h-screen w-full flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:gap-6 lg:p-6">
        <aside
          className={`fixed inset-y-3 left-3 z-30 flex w-72 flex-col rounded-[30px] border border-[#dfe9e1] bg-[#0f1f16] p-4 text-white shadow-[0_18px_45px_rgba(13,31,22,0.18)] transition-transform duration-200 lg:static lg:max-w-72 lg:translate-x-0 lg:p-5 ${
            isMobileSidebarOpen ? "translate-x-0" : "translate-x-[-120%]"
          } lg:flex`}
        >
          <div className="mb-3 flex items-center justify-between lg:mb-0 lg:justify-start">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 lg:border-b lg:pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d7b4b]">
                <HandHeart size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200/80">
                  ShareHope
                </p>
                <h1 className="text-xl font-semibold">Donor Portal</h1>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center text-white lg:hidden"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          <nav className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {navigation.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTab(key);
                    setIsMobileSidebarOpen(false);
                  }}
                  title={label}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all sm:justify-center lg:justify-start ${
                    isActive
                      ? "bg-[#1f8d52] text-white"
                      : "bg-white/5 text-emerald-50/80 hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <Logout />
            </div>
          </div>
        </aside>

        <main className="flex-1 rounded-[30px] border border-[#dfe9e1] bg-white p-4 shadow-[0_18px_45px_rgba(11,46,22,0.05)] sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-3 border-b border-border-light pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#607166]">
                Welcome back
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#122718] sm:text-3xl">
                {user?.name || "Donor dashboard"}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Open donor panel"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center self-end rounded-xl border border-[#e3ebdf] bg-[#f7faf7] text-[#10261a] transition-colors hover:bg-[#edf5ee] lg:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </header>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Donor;
