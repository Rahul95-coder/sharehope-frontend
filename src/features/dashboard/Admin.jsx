import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  HandHeart,
  LayoutDashboard,
  Menu,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../../lib/axios";
import { Logout } from "../../shared/components/Logout";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Donations", icon: HandHeart },
  { label: "Donors", icon: Users },
  { label: "NGOs", icon: BriefcaseBusiness },
];

const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "User";
const formatStatus = (status) =>
  status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Pending";

const formatLabel = (value) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "-";

// document onClick handler to open document in new tab

const DocumentLink = ({ url }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openDocument = async () => {
    const previewWindow = window.open("about:blank", "_blank");
    if (!previewWindow) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(url, { responseType: "blob" });
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const documentUrl = URL.createObjectURL(pdfBlob);
      previewWindow.location.href = documentUrl;
    } catch {
      previewWindow.close();
      toast.error("Unable to load this document.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={openDocument}
      disabled={isLoading}
      className="font-medium text-[#0f7a3a] underline disabled:cursor-wait disabled:opacity-60"
    >
      {isLoading ? "Opening..." : "View document"}
    </button>
  );
};

// this can be shared component UserTable , good work
const UserTable = ({ users, emptyMessage }) => (
  <div className="overflow-x-auto">
    {users.length ? (
      <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
        <thead>
          <tr className="text-[#607166]">
            <th className="px-3 py-2 font-semibold">Name</th>
            <th className="px-3 py-2 font-semibold">Email</th>
            <th className="px-3 py-2 font-semibold">Phone</th>
            <th className="px-3 py-2 font-semibold">Contact person</th>
            <th className="px-3 py-2 font-semibold">Address</th>
            <th className="px-3 py-2 font-semibold">City</th>
            <th className="px-3 py-2 font-semibold">State</th>
            <th className="px-3 py-2 font-semibold">Pincode</th>
            <th className="px-3 py-2 font-semibold">Donor type</th>
            <th className="px-3 py-2 font-semibold">Registration no.</th>
            <th className="px-3 py-2 font-semibold">Status</th>
            <th className="px-3 py-2 font-semibold">Created</th>
            <th className="px-3 py-2 font-semibold">Document</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white text-[#14261a]">
              <td className="rounded-l-2xl border border-[#e8efe9] px-3 py-3 font-medium">
                {user.name || "Unknown user"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.email || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.phone || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.contact_person_name || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.address || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.city || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.state || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.pincode || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.donor_type || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                {user.registration_number || "-"}
              </td>
              <td className="border border-[#e8efe9] px-3 py-3">
                <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[10px] font-semibold text-[#1f5ab7]">
                  {formatStatus(user.status)}
                </span>
              </td>
              <td className="border border-[#e8efe9] px-3 py-3 whitespace-nowrap">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN")
                  : "-"}
              </td>
              <td className="rounded-r-2xl border border-[#e8efe9] px-3 py-3">
                {user.documentUrl ? (
                  <DocumentLink url={user.documentUrl} />
                ) : (
                  <span className="text-[#607166]">No document</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-white p-5 text-sm text-[#607166]">
        {emptyMessage}
      </div>
    )}
  </div>
);

// okay,  nothing to change
const DonorDirectory = ({ donors }) => (
  <section className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
      Donors
    </p>
    <h3 className="mt-1 text-xl font-bold text-[#14261a]">
      All donors ({donors.length})
    </h3>
    <div className="mt-4">
      <UserTable users={donors} emptyMessage="No donors found." />
    </div>
  </section>
);

//okay, nothing to change
const NgoDirectory = ({ ngos }) => (
  <section className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
      NGOs
    </p>
    <h3 className="mt-1 text-xl font-bold text-[#14261a]">
      All NGOs ({ngos.length})
    </h3>
    <div className="mt-4">
      <UserTable users={ngos} emptyMessage="No NGOs found." />
    </div>
  </section>
);

//okay, nothing to change
const DonationDirectory = ({ donations, onStatusUpdate, isUpdating }) => (
  <section className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
      Donations
    </p>
    <h3 className="mt-1 text-xl font-bold text-[#14261a]">
      All donations ({donations.length})
    </h3>
    <div className="mt-4 overflow-x-auto">
      {donations.length ? (
        <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-[#607166]">
              <th className="px-3 py-2 font-semibold">Title</th>
              <th className="px-3 py-2 font-semibold">Donor</th>
              <th className="px-3 py-2 font-semibold">Category</th>
              <th className="px-3 py-2 font-semibold">Quantity</th>
              <th className="px-3 py-2 font-semibold">Food type</th>
              <th className="px-3 py-2 font-semibold">Expiry</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr
                key={donation._id}
                className="bg-white text-[#14261a] transition-colors duration-200 hover:bg-[#f2faf4]"
              >
                <td className="rounded-l-2xl border border-[#e8efe9] px-3 py-3 font-medium">
                  {donation.title || "Untitled donation"}
                </td>
                <td className="border border-[#e8efe9] px-3 py-3">
                  {donation.donor_id?.name || "Unknown donor"}
                  <span className="block text-xs text-[#607166]">
                    {donation.donor_id?.email || "-"}
                  </span>
                </td>
                <td className="border border-[#e8efe9] px-3 py-3">
                  {formatLabel(donation.category)}
                </td>
                <td className="border border-[#e8efe9] px-3 py-3">
                  {donation.qty ?? "-"} {donation.unit || ""}
                </td>
                <td className="border border-[#e8efe9] px-3 py-3">
                  {formatLabel(donation.food_type)}
                </td>
                <td className="border border-[#e8efe9] px-3 py-3 whitespace-nowrap">
                  {donation.expiry_datetime
                    ? new Date(donation.expiry_datetime).toLocaleString("en-IN")
                    : "-"}
                </td>
                <td className="rounded-r-2xl border border-[#e8efe9] px-3 py-3">
                  <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[10px] font-semibold text-[#1f5ab7]">
                    {formatStatus(donation.status)}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {donation.status === "PENDING" ? (
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          onStatusUpdate(donation._id, "AVAILABLE")
                        }
                        className="rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold text-[#0f7a3a] transition-colors hover:bg-[#bceccf] focus:outline-none focus:ring-2 focus:ring-[#1f8d52]/30 disabled:opacity-50"
                      >
                        Available
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onStatusUpdate(donation._id, "EXPIRED")}
                        className="rounded-full bg-[#fdecec] px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-[#f8d4d4] focus:outline-none focus:ring-2 focus:ring-danger/30 disabled:opacity-50"
                      >
                        Expired
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-white p-5 text-sm text-[#607166]">
          No donations found.
        </div>
      )}
    </div>
  </section>
);

const Admin = () => {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // okay,  nothing to change
  const handleNavigation = (label) => {
    setActiveSection(label);
    setIsSidebarOpen(false);
  };

  // aa query, aya  no hovi joyee hook.js ma j hovi joye and teni query key queryKeys mathi j levani, query key centralizes kareli che , jo dekhadu
  const userQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [
        pendingDonors,
        pendingNgos,
        verifiedDonors,
        verifiedNgos,
        rejectedDonors,
        rejectedNgos,
      ] = await Promise.all([
        api.get("/admin/user", {
          params: { role: "DONOR", status: "PENDING" },
        }),
        api.get("/admin/user", { params: { role: "NGO", status: "PENDING" } }),
        api.get("/admin/user", {
          params: { role: "DONOR", status: "VERIFIED" },
        }),
        api.get("/admin/user", { params: { role: "NGO", status: "VERIFIED" } }),
        api.get("/admin/user", {
          params: { role: "DONOR", status: "REJECTED" },
        }),
        api.get("/admin/user", { params: { role: "NGO", status: "REJECTED" } }),
      ]);

      const pendingUsers = [
        ...(Array.isArray(pendingDonors.data) ? pendingDonors.data : []),
        ...(Array.isArray(pendingNgos.data) ? pendingNgos.data : []),
      ].filter(
        (user, index, arr) =>
          arr.findIndex((item) => item._id === user._id) === index,
      );

      const verifiedUsers = [
        ...(Array.isArray(verifiedDonors.data) ? verifiedDonors.data : []),
        ...(Array.isArray(verifiedNgos.data) ? verifiedNgos.data : []),
      ].filter(
        (user, index, arr) =>
          arr.findIndex((item) => item._id === user._id) === index,
      );

      const rejectedUsers = [
        ...(Array.isArray(rejectedDonors.data) ? rejectedDonors.data : []),
        ...(Array.isArray(rejectedNgos.data) ? rejectedNgos.data : []),
      ].filter(
        (user, index, arr) =>
          arr.findIndex((item) => item._id === user._id) === index,
      );

      const allUsers = [
        ...pendingUsers,
        ...verifiedUsers,
        ...rejectedUsers,
      ].filter(
        (user, index, arr) =>
          arr.findIndex((item) => item._id === user._id) === index,
      );

      return {
        pendingUsers,
        verifiedUsers,
        rejectedUsers,
        allUsers,
        pendingDonors: Array.isArray(pendingDonors.data)
          ? pendingDonors.data
          : [],
        pendingNgos: Array.isArray(pendingNgos.data) ? pendingNgos.data : [],
      };
    },
    staleTime: 30_000,
  });

  // aa query, aya  no hovi joyee hook.js ma j hovi joye and teni query key queryKeys mathi j levani, query key centralizes kareli che , jo dekhadu
  const donationQuery = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const statuses = ["PENDING", "AVAILABLE", "ACCEPTED", "EXPIRED"];
      const responses = await Promise.all(
        statuses.map((status) =>
          api.get("/admin/donation", { params: { status } }),
        ),
      );

      return responses
        .flatMap((response) =>
          Array.isArray(response.data) ? response.data : [],
        )
        .filter((donation) => donation.donor_id)
        .filter(
          (donation, index, donations) =>
            donations.findIndex((item) => item._id === donation._id) === index,
        );
    },
    staleTime: 30_000,
  });

  // aa query, aya  no hovi joyee hook.js ma j hovi joye and teni query key queryKeys mathi j levani, query key centralizes kareli che , jo dekhadu
  const updateUserStatus = useMutation({
    mutationFn: ({ userId, status }) =>
      api.put("/admin/user", { userId, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User ${variables.status.toLowerCase()} successfully.`);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update user status",
      );
    },
  });

  // aa query, aya  no hovi joyee hook.js ma j hovi joye and teni query key queryKeys mathi j levani, query key centralizes kareli che , jo dekhadu
  const updateDonationStatus = useMutation({
    mutationFn: ({ donationId, status }) =>
      api.put("/admin/donation", { donationId, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      toast.success(`Donation marked ${variables.status.toLowerCase()}.`);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update donation status",
      );
    },
  });

  // okay, nothing to change
  const pendingUsers = userQuery.data?.pendingUsers ?? [];
  const verifiedUsers = userQuery.data?.verifiedUsers ?? [];
  const rejectedUsers = userQuery.data?.rejectedUsers ?? [];
  const allUsers = userQuery.data?.allUsers ?? [];
  const allDonations = donationQuery.data ?? [];
  const donors = allUsers.filter((user) => user.role === "DONOR");
  const ngos = allUsers.filter((user) => user.role === "NGO");

  // okay, nothing to change
  const metrics = [
    {
      label: "Pending requests",
      value: String(pendingUsers.length),
      change: "Live",
      tone: "green",
    },
    {
      label: "Verified users",
      value: String(verifiedUsers.length),
      change: "+12.4%",
      tone: "blue",
    },
    {
      label: "Rejected",
      value: String(rejectedUsers.length),
      change: "Review",
      tone: "amber",
    },
    {
      label: "Total accounts",
      value: String(
        verifiedUsers.length + pendingUsers.length + rejectedUsers.length,
      ),
      change: "All",
      tone: "purple",
    },
  ];

  //okay
  const handleUserStatus = (userId, status) => {
    updateUserStatus.mutate({ userId, status });
  };

  //okay, nothing to change
  const handleDonationStatus = (donationId, status) => {
    updateDonationStatus.mutate({ donationId, status });
  };

  // okay,  nothing to change
  const activity = [...pendingUsers, ...verifiedUsers, ...rejectedUsers]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map((user) => ({
      text: `${user.name || "New user"} is ${formatStatus(user.status)} as ${formatRole(user.role)}`,
      time: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })
        : "Today",
    }));

  return (
    <div className="min-h-screen bg-[#f3f7f3] text-[#15261b]">
      <header className="border-b border-[#dfe9e1] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-375 items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1d7b4b] text-white shadow-sm">
              <HandHeart size={18} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#607166]">
                ShareHope
              </p>
              <h1 className="text-base font-bold text-[#14261a] sm:text-lg">
                Admin Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open admin panel"
              className="rounded-xl border border-[#e3ebdf] bg-[#f7faf7] p-2 text-[#0f1f16] transition hover:bg-[#edf5ee] lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="rounded-xl border border-[#e3ebdf] bg-[#f7faf7] px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#607166]">
                Admin
              </p>
              <p className="text-xs font-semibold text-[#14261a]">Operations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-375 flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:gap-6 lg:p-6">
        <aside className="hidden w-full rounded-[30px] border border-[#dfe9e1] bg-[#0f1f16] p-4 text-white shadow-[0_18px_45px_rgba(13,31,22,0.18)] lg:block lg:max-w-70">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d7b4b]">
              <HandHeart size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">
                ShareHope
              </p>
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNavigation(label)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all ${
                  activeSection === label
                    ? "bg-[#1f8d52] text-white shadow-md"
                    : "bg-white/5 text-emerald-50/80 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-emerald-100/90">
              <div className="h-2.5 w-2.5 rounded-full bg-[#77f0ac]" />
              <span className="text-xs font-medium uppercase tracking-[0.12em]">
                System status
              </span>
            </div>
            <p className="text-sm text-emerald-50/80">
              All modules are operational.
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <Logout />
            </div>
          </div>
        </aside>

        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
            isSidebarOpen
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
        >
          <button
            type="button"
            aria-label="Close admin panel"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-[#07130c]/60"
          />
          <aside
            className={`relative flex h-full w-72 max-w-[85vw] flex-col bg-[#0f1f16] p-4 text-white shadow-[0_18px_45px_rgba(13,31,22,0.3)] transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d7b4b]">
                <HandHeart size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">
                  ShareHope
                </p>
                <h1 className="text-xl font-semibold">Admin Panel</h1>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close admin panel"
                className="ml-auto rounded-xl p-2 text-emerald-50 transition hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleNavigation(label)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all ${
                    activeSection === label
                      ? "bg-[#1f8d52] text-white shadow-md"
                      : "bg-white/5 text-emerald-50/80 hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center gap-2 text-emerald-100/90">
                <div className="h-2.5 w-2.5 rounded-full bg-[#77f0ac]" />
                <span className="text-xs font-medium uppercase tracking-[0.12em]">
                  System status
                </span>
              </div>
              <p className="text-sm text-emerald-50/80">
                All modules are operational.
              </p>
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <Logout />
              </div>
            </div>
          </aside>
        </div>

        <main className="flex-1 rounded-[30px] border border-[#dfe9e1] bg-white p-4 shadow-[0_18px_45px_rgba(11,46,22,0.05)] sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-border-light pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#607166]">
                Welcome back
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#122718] sm:text-3xl">
                Admin dashboard
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="rounded-2xl border border-[#e3ebdf] bg-[#f7faf7] px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.12em] text-[#607166]">
                  Today
                </p>
                <p className="text-sm font-semibold text-[#14261a]">
                  {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </header>

          {userQuery.isLoading ? (
            <div className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-6 text-sm text-[#607166]">
              Loading admin data...
            </div>
          ) : userQuery.isError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Unable to load admin data right now. Please try again later.
            </div>
          ) : donationQuery.isError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Users loaded, but donations could not be loaded right now.
            </div>
          ) : donationQuery.isLoading ? (
            <div className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-6 text-sm text-[#607166]">
              Loading donations...
            </div>
          ) : activeSection === "Donors" ? (
            <DonorDirectory donors={donors} />
          ) : activeSection === "NGOs" ? (
            <NgoDirectory ngos={ngos} />
          ) : activeSection === "Donations" ? (
            <DonationDirectory
              donations={allDonations}
              onStatusUpdate={handleDonationStatus}
              isUpdating={updateDonationStatus.isPending}
            />
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ label, value, change, tone }) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-[#607166]">{label}</p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          tone === "green"
                            ? "bg-success-light text-[#0f7a3a]"
                            : tone === "blue"
                              ? "bg-[#edf5ff] text-[#1f5ab7]"
                              : tone === "amber"
                                ? "bg-[#fff5db] text-[#b27400]"
                                : "bg-[#f0ebff] text-[#5c3cc9]"
                        }`}
                      >
                        {change}
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <h3 className="text-3xl font-bold text-[#14261a]">
                        {value}
                      </h3>
                      <TrendingUp size={18} className="text-[#1a7d4d]" />
                    </div>
                  </div>
                ))}
              </section>

              <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.9fr]">
                <div className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                        Approvals
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                        New donor & NGO accounts
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full bg-[#0f1f16] px-3 py-2 text-xs font-medium text-white"
                    >
                      Review requests
                      <ArrowUpRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {pendingUsers.length ? (
                      pendingUsers.map((user) => (
                        <div
                          key={user._id}
                          className="rounded-2xl border border-[#e8efe9] bg-white p-3 sm:p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-[#14261a]">
                                  {user.name}
                                </p>
                                <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[10px] font-semibold text-[#1f5ab7]">
                                  {formatRole(user.role)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-[#607166]">
                                {user.email}
                              </p>
                              <p className="mt-1 text-xs text-[#607166]">
                                {user.city ||
                                  user.state ||
                                  "Location not added"}{" "}
                                • {user.phone || "No phone"}
                              </p>
                            </div>

                            <span className="rounded-full bg-[#fff5db] px-2.5 py-1 text-[11px] font-semibold text-[#b27400]">
                              {formatStatus(user.status)}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[#42564b]">
                            <div className="flex items-center gap-2">
                              {user.role === "NGO" && user.documentUrl ? (
                                <DocumentLink url={user.documentUrl} />
                              ) : (
                                <span>
                                  {user.donor_type || "General donor"}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUserStatus(user._id, "VERIFIED")
                                }
                                className="flex items-center gap-1 rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold text-[#0f7a3a]"
                              >
                                <Check size={14} />
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUserStatus(user._id, "REJECTED")
                                }
                                className="flex items-center gap-1 rounded-full bg-[#fdecec] px-3 py-1.5 text-xs font-semibold text-danger"
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-white p-5 text-sm text-[#607166]">
                        No new donor or NGO account requests right now.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                        Overview
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                        Verification summary
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Pending", value: pendingUsers.length },
                      { name: "Verified", value: verifiedUsers.length },
                      { name: "Rejected", value: rejectedUsers.length },
                    ].map(({ name, value }) => (
                      <div key={name}>
                        <div className="mb-2 flex items-center justify-between text-sm text-[#42564b]">
                          <span>{name}</span>
                          <span className="font-semibold text-[#14261a]">
                            {value}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-border-light">
                          <div
                            className="h-2.5 rounded-full bg-[#1d7b4b]"
                            style={{
                              width: `${Math.max(12, (value / Math.max(1, pendingUsers.length + verifiedUsers.length + rejectedUsers.length)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section
                id="admin-directory"
                className="mt-6 grid gap-6 xl:grid-cols-2"
              >
                <div className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                      Donors
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                      All donors ({donors.length})
                    </h3>
                  </div>
                  <UserTable users={donors} emptyMessage="No donors found." />
                </div>

                <div className="rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                      NGOs
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                      All NGOs ({ngos.length})
                    </h3>
                  </div>
                  <UserTable users={ngos} emptyMessage="No NGOs found." />
                </div>
              </section>

              <section className="hidden">
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                    Directory
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                    All donors and NGOs
                  </h3>
                </div>

                {allUsers.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                      <thead>
                        <tr className="text-[#607166]">
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Role</th>
                          <th className="px-3 py-2 font-semibold">Email</th>
                          <th className="px-3 py-2 font-semibold">Phone</th>
                          <th className="px-3 py-2 font-semibold">
                            Contact person
                          </th>
                          <th className="px-3 py-2 font-semibold">Address</th>
                          <th className="px-3 py-2 font-semibold">City</th>
                          <th className="px-3 py-2 font-semibold">State</th>
                          <th className="px-3 py-2 font-semibold">Pincode</th>
                          <th className="px-3 py-2 font-semibold">
                            Donor type
                          </th>
                          <th className="px-3 py-2 font-semibold">
                            Registration no.
                          </th>
                          <th className="px-3 py-2 font-semibold">Status</th>
                          <th className="px-3 py-2 font-semibold">Created</th>
                          <th className="px-3 py-2 font-semibold">Document</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="rounded-2xl border border-[#e8efe9] bg-white text-[#14261a]"
                          >
                            <td className="rounded-l-2xl border border-[#e8efe9] px-3 py-3 font-medium">
                              {user.name || "Unknown user"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {formatRole(user.role)}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.email || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.phone || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.contact_person_name || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.address || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.city || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.state || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.pincode || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.donor_type || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {user.registration_number || "-"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[10px] font-semibold text-[#1f5ab7]">
                                {formatStatus(user.status)}
                              </span>
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3 whitespace-nowrap">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "-"}
                            </td>
                            <td className="rounded-r-2xl border border-[#e8efe9] px-3 py-3">
                              {user.documentUrl ? (
                                <DocumentLink url={user.documentUrl} />
                              ) : (
                                <span className="text-[#607166]">
                                  No document
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-white p-5 text-sm text-[#607166]">
                    No users found.
                  </div>
                )}
              </section>
              <section
                id="admin-donations"
                className="mt-6 rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5"
              >
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                    Donations
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                    All donations ({allDonations.length})
                  </h3>
                </div>

                {allDonations.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                      <thead>
                        <tr className="text-[#607166]">
                          <th className="px-3 py-2 font-semibold">Title</th>
                          <th className="px-3 py-2 font-semibold">Donor</th>
                          <th className="px-3 py-2 font-semibold">Category</th>
                          <th className="px-3 py-2 font-semibold">Quantity</th>
                          <th className="px-3 py-2 font-semibold">Food type</th>
                          <th className="px-3 py-2 font-semibold">Expiry</th>
                          <th className="px-3 py-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allDonations.map((donation) => (
                          <tr
                            key={donation._id}
                            className="bg-white text-[#14261a]"
                          >
                            <td className="rounded-l-2xl border border-[#e8efe9] px-3 py-3 font-medium">
                              {donation.title || "Untitled donation"}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {donation.donor_id?.name || "Unknown donor"}
                              <span className="block text-xs text-[#607166]">
                                {donation.donor_id?.email || "-"}
                              </span>
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {formatLabel(donation.category)}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {donation.qty ?? "-"} {donation.unit || ""}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3">
                              {formatLabel(donation.food_type)}
                            </td>
                            <td className="border border-[#e8efe9] px-3 py-3 whitespace-nowrap">
                              {donation.expiry_datetime
                                ? new Date(
                                    donation.expiry_datetime,
                                  ).toLocaleString("en-IN")
                                : "-"}
                            </td>
                            <td className="rounded-r-2xl border border-[#e8efe9] px-3 py-3">
                              <span className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[10px] font-semibold text-[#1f5ab7]">
                                {formatStatus(donation.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-white p-5 text-sm text-[#607166]">
                    No donations found.
                  </div>
                )}
              </section>

              <section className="mt-6 rounded-3xl border border-[#e3ebdf] bg-[#f9fbf9] p-4 sm:p-5">
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#607166]">
                    Activity
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-[#14261a]">
                    Latest updates
                  </h3>
                </div>

                <div className="space-y-3">
                  {activity.length ? (
                    activity.map(({ text, time }) => (
                      <div
                        key={`${text}-${time}`}
                        className="flex items-start gap-3 rounded-2xl border border-[#e8efe9] bg-white p-3"
                      >
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-success-light text-[#0f7a3a]">
                          <TrendingUp size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#14261a]">{text}</p>
                          <p className="mt-1 text-xs text-[#607166]">{time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#d3dfd6] bg-white p-5 text-sm text-[#607166]">
                      No activity yet.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <footer className="border-t border-[#dfe9e1] bg-white">
        <div className="mx-auto flex max-w-375 flex-col gap-4 px-4 py-6 text-sm text-[#607166] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-[#14261a]">ShareHope</p>
            <p>Food security and community support for every neighborhood.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="transition hover:text-[#0f7a3a]">
              Privacy
            </a>
            <a href="#" className="transition hover:text-[#0f7a3a]">
              Terms
            </a>
            <a href="#" className="transition hover:text-[#0f7a3a]">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
