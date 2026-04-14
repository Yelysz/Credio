export const getEmployeeIdFromToken = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return "";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.uid || payload.sub || "";
  } catch {
    return "";
  }
};