import {
  AMC_API_KEY,
  SANDBOX_URL,
  getDefaultTheatreShowtimePath,
  getTheatreSeatsPath,
  DEFAULT_HEADERS,
  getLocationPath,
  getQueryParamString,
  AMC_FORMATS,
} from "./constants.js";

import { Movie, SeatMap, Showtime } from "../code/index.js";
import { findBestSeat } from "../code/utility.js";

const base = `${SANDBOX_URL}${getLocationPath("NY")}`;
const queryParams = getQueryParamString(1, 10, "");
const path = queryParams.length > 0 ? `${base}?${queryParams}` : base;

const fetchData = async (date) => {
  const showtimesPath = getDefaultTheatreShowtimePath(date);
  const movieData = await defaultReq(showtimesPath);
  const movies = Movie.from(movieData);

  if (movies.length === 0) {
    return;
  }

  const movie = movies.at(0);
  const showtimes = movie
    .getAvailableShowtimes()
    .filter((s) => s.format === AMC_FORMATS.imax);
  const bestSeats = [];

  for (let i = 0; i < showtimes.length; i++) {
    const result = await getBestSeatPerShowing(showtimes[i]);
    if (result) {
      bestSeats.push(result);
    }
  }
  if (bestSeats.length > 0) {
    console.log(bestSeats);
  } else {
    console.log(
      ` ====== No good seats were found for ${date}, sorry! :( ======`,
    );
  }
};

const getBestSeatPerShowing = async (showtime) => {
  const seatPath = getTheatreSeatsPath(showtime.id, showtime.auditorium);
  const seatData = await defaultReq(seatPath);
  const seats = SeatMap.from(seatData);
  const availableSeats = seats
    .getAvailableSeats()
    .filter((s) => !s.isWheelchair && !s.isCompanion);

  return findBestSeat(showtime, availableSeats, seats);
};

const defaultReq = (path) => handleRequest(path, "GET", DEFAULT_HEADERS, {});

const handleRequest = async (path, method, headers, body) => {
  const req = {
    method: method,
    headers: headers,
    ...(method == "POST" && { body: JSON.stringify(body) }),
  };

  const res = await fetch(path, req).catch((error) => console.error(error));
  const data = await res.json();
  return data;
};

const startDate = new Date("2026-07-21");
const endDate = new Date("2026-08-21");
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
  await fetchData(currentDate.toISOString().split("T")[0]);
  currentDate.setDate(currentDate.getDate() + 1);
}
