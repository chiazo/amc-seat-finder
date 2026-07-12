import dotenv from "dotenv";

export const AMC_API_KEY = import.meta.env.VITE_AMC_API_KEY;
export const BACKUP_URL = import.meta.env.VITE_BACKUP_URL;
export const AMC_FORMATS = {
  imax: "IMAX 70MM",
  dolby: "Dolby",
  standard: "Standard",
  "70mm": "70mm",
};
export const LINCOLN_13 = "amc-2116";

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
    ...(!!pageNum && { "page-number": pageNum }),
    ...(!!pageSize && { "page-size": pageSize }),
    ...(!!sortBy && { "sort-by": sortBy }),
  });
};

export const getLocationPath = (state) => `/v2/locations/states/${state}`;

export const getTheatresPath = () => `/api/theatres`;
export const getDefaultTheatreShowtimePath = (date) =>
  getTheatreShowtimePath(LINCOLN_13, date);
export const getTheatreShowtimePath = (amcTheatreId, date) =>
  `/api/showtimes?theatre_id=${amcTheatreId}&date=${date}&chain=amc`;
export const getTheatreSeatsPath = (showtimeId, auditorium, theatreId) =>
  `/api/seats?showtime_id=${showtimeId}&chain=amc&theatre_id=${theatreId}&auditorium=${auditorium}`;
