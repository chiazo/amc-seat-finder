import dotenv from "dotenv";

export const {
  parsed: { AMC_API_KEY },
} = dotenv.config();

// website https://www.sandbox-amctheatres.com/
export const SANDBOX_URL = "https://api.sandbox-amctheatres.com";
export const PRODUCTION_URL = "https://api.amctheatres.com";

// Request Constants
export const DEFAULT_HEADERS = {
  accept: "application/json",
  "x-amc-vendor-key": AMC_API_KEY,
  "x-amc-auth-token": AMC_API_KEY,
};
export const getQueryParamString = (pageNum, pageSize, sortBy) => {
  if (!pageNum && !pageSize && !sortBy) {
    return "";
  }
  return new URLSearchParams({
    ...(!!pageNum && { ["page-number"]: pageNum }),
    ...(!!pageSize && { ["page-size"]: pageSize }),
    ...(!!sortBy && { ["sort-by"]: sortBy }),
  });
};

export const getLocationPath = (state) => `/v2/locations/states/${state}`;
