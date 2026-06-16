// HackClub VIT Chennai — organisational departments and the role system that
// hangs off them. Shared by the signup form, admin user management, the member
// profile editor and the lead dashboards so the option lists never drift.

export const HACKCLUB_DEPARTMENTS = [
  'Projects',
  'Finance',
  'Design',
  'Research and Development',
  'Operations',
  'Technical',
];

// Roles that get the full Admin portal (same rights/dashboard as Admin).
export const ADMIN_ROLES = ['Admin', 'Vice Chairperson', 'Secretary', 'Co Secretary'];

// One lead role per department, e.g. "Projects Lead".
export const LEAD_ROLES = HACKCLUB_DEPARTMENTS.map((d) => `${d} Lead`);

// Everything the admin can assign from the Manage Users role dropdown. Member
// stays a plain option; "Lead" is expanded into the per-department leads.
export const ASSIGNABLE_ROLES = [
  'Admin',
  'Member',
  'Vice Chairperson',
  'Secretary',
  'Co Secretary',
  ...LEAD_ROLES,
];

export function isLeadRole(role) {
  return typeof role === 'string' && role.endsWith(' Lead');
}

export function isAdminRole(role) {
  return ADMIN_ROLES.some((r) => r.toLowerCase() === String(role || '').toLowerCase());
}

// A lead's department is encoded in their role string ("Design Lead" -> "Design").
// Members carry an explicit `department` field instead.
export function departmentFromRole(role) {
  return isLeadRole(role) ? role.slice(0, -' Lead'.length) : null;
}

// The HackClub department a user belongs to, whether they are a member (explicit
// field) or a lead (derived from the role).
export function resolveUserDepartment(user) {
  if (!user) return null;
  return departmentFromRole(user.role) || user.department || null;
}
