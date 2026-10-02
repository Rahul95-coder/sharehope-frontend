import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute, PublicOnlyRoute } from './components/routes/RoleRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ImpactPage } from './pages/public/ImpactPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { NotificationsPage } from './pages/common/NotificationsPage';
// Donor Pages
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { CreateDonationPage } from './pages/donor/CreateDonationPage';
import { MyDonationsPage } from './pages/donor/MyDonationsPage';
import { DonationDetailPage } from './pages/donor/DonationDetailPage';
import { DonorClaimsPage } from './pages/donor/DonorClaimsPage';
import { DonorProfilePage } from './pages/donor/DonorProfilePage';
// NGO Pages
import { NGODashboard } from './pages/ngo/NGODashboard';
import { BrowseDonationsPage } from './pages/ngo/BrowseDonationsPage';
import { NGODonationDetailPage } from './pages/ngo/NGODonationDetailPage';
import { NGOClaimsPage } from './pages/ngo/NGOClaimsPage';
import { NGOHistoryPage } from './pages/ngo/NGOHistoryPage';
import { NGOProfilePage } from './pages/ngo/NGOProfilePage';
// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VerificationPage } from './pages/admin/VerificationPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AdminDonationsPage } from './pages/admin/AdminDonationsPage';
import { AdminClaimsPage } from './pages/admin/AdminClaimsPage';
import { AdminImpactPage } from './pages/admin/AdminImpactPage';
export const App = () => {
    return (<Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />}/>
      <Route path="/about" element={<AboutPage />}/>
      <Route path="/how-it-works" element={<HowItWorksPage />}/>
      <Route path="/impact" element={<ImpactPage />}/>
      <Route path="/contact" element={<ContactPage />}/>

      {/* Auth Public-Only Routes */}
      <Route path="/login" element={<PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>}/>
      <Route path="/register" element={<PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>}/>

      {/* General Protected Routes */}
      <Route path="/notifications" element={<ProtectedRoute>
            <div className="min-h-screen bg-[#FCF9F8] p-4 sm:p-8">
              <NotificationsPage />
            </div>
          </ProtectedRoute>}/>

      {/* Donor Portal */}
      <Route path="/donor" element={<RoleRoute allowedRoles={['DONOR']}>
            <DashboardLayout />
          </RoleRoute>}>
        <Route index element={<Navigate to="/donor/dashboard" replace/>}/>
        <Route path="dashboard" element={<DonorDashboard />}/>
        <Route path="donations" element={<MyDonationsPage />}/>
        <Route path="donations/create" element={<CreateDonationPage />}/>
        <Route path="donations/:id" element={<DonationDetailPage />}/>
        <Route path="claims" element={<DonorClaimsPage />}/>
        <Route path="profile" element={<DonorProfilePage />}/>
        <Route path="impact" element={<ImpactPage />}/>
      </Route>

      {/* NGO Portal */}
      <Route path="/ngo" element={<RoleRoute allowedRoles={['NGO']}>
            <DashboardLayout />
          </RoleRoute>}>
        <Route index element={<Navigate to="/ngo/dashboard" replace/>}/>
        <Route path="dashboard" element={<NGODashboard />}/>
        <Route path="donations" element={<BrowseDonationsPage />}/>
        <Route path="donations/:id" element={<NGODonationDetailPage />}/>
        <Route path="claims" element={<NGOClaimsPage />}/>
        <Route path="pickups" element={<Navigate to="/ngo/claims" replace/>}/>
        <Route path="history" element={<NGOHistoryPage />}/>
        <Route path="profile" element={<NGOProfilePage />}/>
        <Route path="impact" element={<ImpactPage />}/>
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<RoleRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </RoleRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace/>}/>
        <Route path="dashboard" element={<AdminDashboard />}/>
        <Route path="verification" element={<VerificationPage />}/>
        <Route path="users" element={<UserManagementPage />}/>
        <Route path="donations" element={<AdminDonationsPage />}/>
        <Route path="claims" element={<AdminClaimsPage />}/>
        <Route path="impact" element={<AdminImpactPage />}/>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>);
};
