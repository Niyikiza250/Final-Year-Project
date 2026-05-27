export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_OTP: '/verify-otp',
  UNAUTHORIZED: '/unauthorized',
  SESSION_EXPIRED: '/session-expired',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  MEMBER_ADD: '/members/add',
  MEMBER_EDIT: '/members/edit/:id',
  MEMBER_DETAILS: '/members/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  EVENTS: '/events',
  EVENT_ADD: '/events/add',
  EVENT_EDIT: '/events/edit/:id',
  EVENT_DETAILS: '/events/:id',
  ATTENDANCE: '/attendance',
  COMMUNICATION: '/communication',
  REPORTS: '/reports',
  ACHIEVEMENTS: '/achievements',
  ADMIN_USERS: '/admin/users',
  FORCE_PASSWORD_CHANGE: '/change-password-force',
};

export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'UNION_LEADER'
  | 'FIELD_LEADER'
  | 'ZONE_LEADER'
  | 'CHURCH_LEADER'
  | 'MEMBER';
