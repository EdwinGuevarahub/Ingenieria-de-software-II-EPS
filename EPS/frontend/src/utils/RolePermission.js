const ROLES = {
  administratorEPS: [
    "view:IPS",
    "create:IPS",
    "update:IPS",
    "delete:IPS"
  ],
  administratorIPS: [
    "view:doctor",
    "create:doctor",
    "update:doctor",
    "delete:doctor"
  ]
};

function hasPermission(role, permission) {
  if (!role || !ROLES[role]) return false;
  return ROLES[role].includes(permission);
}
