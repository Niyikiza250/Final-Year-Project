import React from 'react';
import { ROUTES, UserRole } from './routes';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  MessageSquare,
  BarChart3,
  Trophy,
  Shield,
  Church,
  Map,
  Activity,
  FileText
} from 'lucide-react';

export interface NavItem {
  to?: string;
  icon: React.ReactNode;
  labelKey: string; // Used for translation key
  roles: UserRole[] | 'ALL';
  subItems?: Omit<NavItem, 'icon' | 'roles' | 'subItems'>[];
}

export const NAVIGATION_CONFIG: NavItem[] = [
  {
    to: ROUTES.DASHBOARD,
    icon: <LayoutDashboard size={20} />,
    labelKey: 'nav.dashboard',
    roles: 'ALL',
  },
  {
    icon: <Users size={20} />,
    labelKey: 'nav.members',
    roles: ['ADMIN', 'MANAGER', 'UNION_LEADER', 'FIELD_LEADER', 'ZONE_LEADER', 'CHURCH_LEADER'],
    subItems: [
      { to: ROUTES.MEMBERS, labelKey: 'nav.directory' },
    ],
  },
  {
    to: ROUTES.EVENTS,
    icon: <Calendar size={20} />,
    labelKey: 'nav.events',
    roles: 'ALL', // Everyone can see events, though their view might differ
  },
  {
    to: ROUTES.ATTENDANCE,
    icon: <UserCheck size={20} />,
    labelKey: 'nav.attendance',
    roles: ['ADMIN', 'MANAGER', 'UNION_LEADER', 'FIELD_LEADER', 'ZONE_LEADER', 'CHURCH_LEADER'],
  },
  {
    to: ROUTES.COMMUNICATION,
    icon: <MessageSquare size={20} />,
    labelKey: 'nav.communication',
    roles: ['ADMIN', 'MANAGER', 'UNION_LEADER', 'FIELD_LEADER', 'ZONE_LEADER', 'CHURCH_LEADER'],
  },
  {
    to: ROUTES.REPORTS,
    icon: <BarChart3 size={20} />,
    labelKey: 'nav.reports',
    roles: ['ADMIN', 'MANAGER', 'UNION_LEADER', 'FIELD_LEADER', 'ZONE_LEADER'], // Higher level leaders
  },
  {
    to: ROUTES.ACHIEVEMENTS,
    icon: <Trophy size={20} />,
    labelKey: 'nav.achievements',
    roles: 'ALL',
  },
  {
    to: ROUTES.ADMIN_USERS,
    icon: <Shield size={20} />,
    labelKey: 'nav.adminUsers',
    roles: ['ADMIN'], // Only Admin
  },
];
