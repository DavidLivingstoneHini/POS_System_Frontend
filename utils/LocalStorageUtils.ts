export const getCompanyId = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const companyId = localStorage.getItem("companyId");
    return companyId ? JSON.parse(companyId) : null;
  }
  return null;
};

export const getStaffId = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const staffId = localStorage.getItem("userID");
    return staffId ? JSON.parse(staffId) : null;
  }
  return null;
};
