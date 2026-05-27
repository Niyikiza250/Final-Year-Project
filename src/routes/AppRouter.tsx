import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ProtectedRoute, PublicRoute, AdminRoute } from './RouteGuards';
import { Loader2 } from 'lucide-react';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import MemberDirectory from '@/pages/MemberDirectory';
import MemberDetails from '@/pages/MemberDetails';
import MemberForm from '@/pages/MemberForm';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import OTPVerification from '@/pages/auth/OTPVerification';
import Unauthorized from '@/pages/auth/Unauthorized';
import SessionExpired from '@/pages/auth/SessionExpired';
import EventDashboard from '@/pages/events/EventDashboard';
import EventForm from '@/pages/events/EventForm';
import EventDetails from '@/pages/events/EventDetails';
import AttendanceTracking from '@/pages/attendance/AttendanceTracking';
import CommunicationHub from '@/pages/communication/CommunicationHub';
import ReportsAnalytics from '@/pages/reports/ReportsAnalytics';
import AchievementsModule from '@/pages/achievements/AchievementsModule';
import UserManagement from '@/pages/admin/UserManagement';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import ForcePasswordChange from '@/pages/auth/ForcePasswordChange';
import Home from '@/pages/Home';


const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <Loader2 className="animate-spin text-sda-blue" size={48} />
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Home Page — no auth required, no layout wrapper */}
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* Public/Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path={ROUTES.VERIFY_OTP} element={<OTPVerification />} />
              <Route path={ROUTES.SESSION_EXPIRED} element={<SessionExpired />} />
            </Route>
          </Route>

          {/* Special Auth Routes (Always accessible or layout-less) */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.FORCE_PASSWORD_CHANGE} element={<ForcePasswordChange />} />
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.MEMBERS} element={<MemberDirectory />} />
              <Route path={ROUTES.MEMBER_DETAILS} element={<MemberDetails />} />
              <Route path={ROUTES.EVENTS} element={<EventDashboard />} />
              <Route path={ROUTES.EVENT_DETAILS} element={<EventDetails />} />
              <Route path={ROUTES.ATTENDANCE} element={<AttendanceTracking />} />
              <Route path={ROUTES.COMMUNICATION} element={<CommunicationHub />} />
              <Route path={ROUTES.REPORTS} element={<ReportsAnalytics />} />
              <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsModule />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.MEMBER_ADD} element={<MemberForm />} />
                <Route path={ROUTES.MEMBER_EDIT} element={<MemberForm />} />
                <Route path={ROUTES.EVENT_ADD} element={<EventForm />} />
                <Route path={ROUTES.EVENT_EDIT} element={<EventForm />} />
                <Route path={ROUTES.ADMIN_USERS} element={<UserManagement />} />
              </Route>
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
