export const getEnvironment = () => {
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes("applicationstudio")) {
    return "dev";
  }
  if (hostname.includes("-uat")) {
    return "uat";
  }
  if (hostname.includes("cfapps")) {
    return "prod";
  }

  return "unknown";
};
