export const PERMISSIONS = {
  ACKNOWLEDGE: "acknowledge",
  ASSIGN: "assign",
  RESOLVE: "resolve",
  CLEAR: "clear",
  VIEW: "view",
  FILTER_ALARMS: "filter_alarms",
  SAVE_FILTERS: "save_filters",
};

export const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.ACKNOWLEDGE,
    PERMISSIONS.ASSIGN,
    PERMISSIONS.RESOLVE,
    PERMISSIONS.CLEAR,
    PERMISSIONS.VIEW,
    PERMISSIONS.FILTER_ALARMS,
    PERMISSIONS.SAVE_FILTERS,
  ],
  operator: [
    PERMISSIONS.ACKNOWLEDGE,
    PERMISSIONS.RESOLVE,
    PERMISSIONS.VIEW,
  ],
  engineer: [
    PERMISSIONS.VIEW,
    PERMISSIONS.FILTER_ALARMS,
  ],
  manager: [
    PERMISSIONS.VIEW,
    PERMISSIONS.FILTER_ALARMS,
    PERMISSIONS.SAVE_FILTERS,
  ],
};

// Utility function
export const hasAccess = (role, permission) => {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
};
