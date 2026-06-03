import React from 'react';
import { ROUTES, UserRole } from './routes';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Church,
  Map,
  Activity,
  FileText,
  Megaphone,
  ClipboardList,
  UserPlus,
  Clock,
  Heart,
  FolderOpen,
  ListChecks,
  ShieldCheck,
  Upload,
  Settings,
  ImagePlus,
} from 'lucide-react';

export interface NavItem {
  to?: string;
  icon: React.ReactNode;
  labelKey: string;
  roles: UserRole[] | 'ALL';
  subItems?: Omit<NavItem, 'icon' | 'roles' | 'subItems'>[];
}

const SUPER_ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN'];
const LEADER_ROLES: UserRole[] = ['SUPER_ADMIN', 'UNION_LEADER', 'FIELD_ADMINISTRATOR', 'FIELD_LEADER', 'DISTRICT_LEADER', 'CHURCH_LEADER', 'MINISTRY_LEADER'];
const ALL_HIGHER_ROLES: UserRole[] = ['SUPER_ADMIN', 'UNION_LEADER', 'FIELD_ADMINISTRATOR', 'FIELD_LEADER', 'DISTRICT_LEADER', 'CHURCH_LEADER'];

export const NAVIGATION_CONFIG: NavItem[] = [
  // Dashboard - ALL roles
  {
    to: ROUTES.DASHBOARD,
    icon: <LayoutDashboard size={20} />,
    labelKey: 'Dashboard',
    roles: 'ALL',
  },

  // ===== SUPER ADMIN ONLY =====
  {
    to: ROUTES.ADMIN_USERS,
    icon: <Users size={20} />,
    labelKey: 'Users',
    roles: SUPER_ADMIN_ROLES,
  },
  {
    to: ROUTES.ROLES_PERMISSIONS,
    icon: <ShieldCheck size={20} />,
    labelKey: 'Roles & Permissions',
    roles: SUPER_ADMIN_ROLES,
  },
  {
    to: ROUTES.REPORTS,
    icon: <FileText size={20} />,
    labelKey: 'Reports & Analytics',
    roles: SUPER_ADMIN_ROLES,
  },
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: SUPER_ADMIN_ROLES,
  },
  {
    to: ROUTES.HERO_CONTROL,
    icon: <ImagePlus size={20} />,
    labelKey: 'Hero Control',
    roles: SUPER_ADMIN_ROLES,
  },
  // ===== UNION LEADER =====
  {
    to: ROUTES.FIELDS,
    icon: <Map size={20} />,
    labelKey: 'Fields',
    roles: ['UNION_LEADER'],
  },
  {
    to: ROUTES.MINISTRY_ACTIVITIES,
    icon: <Activity size={20} />,
    labelKey: 'Ministry Activities',
    roles: ['UNION_LEADER'],
  },
  {
    to: ROUTES.REPORTS,
    icon: <FileText size={20} />,
    labelKey: 'Reports & Analytics',
    roles: ['UNION_LEADER'],
  },
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: ['UNION_LEADER'],
  },
  // ===== FIELD ADMINISTRATOR =====
  {
    to: ROUTES.ADMIN_USERS,
    icon: <Users size={20} />,
    labelKey: 'User Management',
    roles: ['FIELD_ADMINISTRATOR'],
  },
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: ['FIELD_ADMINISTRATOR'],
  },
  {
    to: ROUTES.EVENTS,
    icon: <Calendar size={20} />,
    labelKey: 'Events',
    roles: ['FIELD_ADMINISTRATOR'],
  },
  {
    to: ROUTES.REPORTS,
    icon: <FileText size={20} />,
    labelKey: 'Reports & Analytics',
    roles: ['FIELD_ADMINISTRATOR'],
  },
  // ===== FIELD LEADER =====
  {
    to: ROUTES.DISTRICTS,
    icon: <Map size={20} />,
    labelKey: 'District Management',
    roles: ['FIELD_LEADER'],
  },
  {
    to: ROUTES.CHURCHES,
    icon: <Church size={20} />,
    labelKey: 'Church Management',
    roles: ['FIELD_LEADER'],
  },
  {
    to: ROUTES.MEMBERS,
    icon: <Users size={20} />,
    labelKey: 'Member Registry',
    roles: ['FIELD_LEADER'],
  },
  {
    to: ROUTES.REPORTS,
    icon: <FileText size={20} />,
    labelKey: 'Reports',
    roles: ['FIELD_LEADER'],
  },
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: ['FIELD_LEADER'],
  },
  {
    to: ROUTES.UPLOADED_FILES,
    icon: <Upload size={20} />,
    labelKey: 'Bulk Registration',
    roles: ['FIELD_LEADER'],
  },
  // ===== DISTRICT LEADER =====
  {
    to: ROUTES.CHURCHES,
    icon: <Church size={20} />,
    labelKey: 'Church Management',
    roles: ['DISTRICT_LEADER'],
  },
  {
    to: ROUTES.MEMBERS,
    icon: <Users size={20} />,
    labelKey: 'Member Registry',
    roles: ['DISTRICT_LEADER'],
  },
  {
    to: ROUTES.REPORTS,
    icon: <FileText size={20} />,
    labelKey: 'Reports',
    roles: ['DISTRICT_LEADER'],
  },
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: ['DISTRICT_LEADER'],
  },
  {
    to: ROUTES.UPLOADED_FILES,
    icon: <Upload size={20} />,
    labelKey: 'Bulk Registration',
    roles: ['DISTRICT_LEADER'],
  },
  // ===== CHURCH LEADER =====
  {
    to: ROUTES.MINISTRY_ACTIVITIES,
    icon: <Activity size={20} />,
    labelKey: 'Ministry Management',
    roles: ['CHURCH_LEADER'],
  },
  {
    to: ROUTES.MEMBERS,
    icon: <Users size={20} />,
    labelKey: 'Member Registry',
    roles: ['CHURCH_LEADER'],
  },
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: ['CHURCH_LEADER'],
  },
  {
    to: ROUTES.UPLOADED_FILES,
    icon: <Upload size={20} />,
    labelKey: 'Bulk Registration',
    roles: ['CHURCH_LEADER'],
  },

  // ===== MINISTRY LEADER =====
  {
    to: ROUTES.MEMBERS,
    icon: <Users size={20} />,
    labelKey: 'Members',
    roles: ['MINISTRY_LEADER'],
  },
  {
    to: ROUTES.VOLUNTEERS,
    icon: <Heart size={20} />,
    labelKey: 'Volunteers',
    roles: ['MINISTRY_LEADER'],
  },
  {
    to: ROUTES.UPLOADED_FILES,
    icon: <Upload size={20} />,
    labelKey: 'Bulk Registration',
    roles: ['MINISTRY_LEADER'],
  },
  // ===== MEMBER =====
  {
    to: ROUTES.ANNOUNCEMENTS,
    icon: <Megaphone size={20} />,
    labelKey: 'Announcements',
    roles: ['MEMBER'],
  },
  {
    to: ROUTES.EVENTS,
    icon: <Calendar size={20} />,
    labelKey: 'Events',
    roles: ['MEMBER'],
  },
  // ===== VOLUNTEER =====
  {
    to: ROUTES.EVENTS,
    icon: <Calendar size={20} />,
    labelKey: 'Events',
    roles: ['VOLUNTEER'],
  },
];
