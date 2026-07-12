import {
  AMC_API_KEY,
  SANDBOX_URL,
  getTheatresPath,
  getTheatreShowtimePath,
  getDefaultTheatreShowtimePath,
  getTheatreSeatsPath,
  DEFAULT_HEADERS,
  getLocationPath,
  getQueryParamString,
  AMC_FORMATS,
  LINCOLN_13,
} from "./constants.js";

import { Movie, SeatMap, Showtime, TheatreCollection } from "../code/index.js";
import { findBestSeat } from "../code/utility.js";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York", // Automatically handles EST/EDT
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true, // Uses AM/PM format
});

export const fetchTheatreData = async () => {
  const theatrePath = getTheatresPath();
  const theatreData = await defaultReq(theatrePath);
  const theatres = TheatreCollection.from(theatreData);
  return theatres;
};

export const fetchAllMovieData = async (theatreId, date) => {
  const showtimesPath = getTheatreShowtimePath(
    theatreId,
    date || new Date().toISOString().split("T")[0],
  );
  const movieData = await defaultReq(showtimesPath);
  const movies = Movie.from(movieData);

  if (movies.length === 0) {
    return;
  }

  return movies;
};

export const fetchIndividualMovieData = async (
  movie,
  format,
  date,
  theatreId,
) => {
  if (!movie) {
    return;
  }
  let showtimes = movie.getAvailableShowtimes();

  if (format && format.length > 0) {
    showtimes = showtimes.filter((s) => s.format === AMC_FORMATS[format]);
  }
  const bestSeats = [];

  for (let i = 0; i < showtimes.length; i++) {
    const result = await getBestSeatPerShowtime(showtimes[i], theatreId);
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
  return bestSeats;
};

const getBestSeatPerShowtime = async (showtime, theatreId) => {
  const { seats, availableSeats } = await getBestSeatPerShowTimeIdAuditorium(
    showtime.id,
    showtime.auditorium,
    theatreId,
  );
  const date = new Date(showtime.utcDateTime);
  const result = findBestSeat(availableSeats, seats);

  if (!result) {
    return result;
  }

  return {
    showtimeId: showtime.id,
    date: date,
    time: dateFormatter.format(date),
    auditorium: showtime.auditorium,
    format: showtime.format,
    url: showtime.purchaseUrl,
    ...result,
  };
};

const getBestSeatPerShowTimeIdAuditorium = async (
  showtimeId,
  showtimeAuditorium,
  theatreId,
) => {
  const seatPath = getTheatreSeatsPath(
    showtimeId,
    showtimeAuditorium,
    theatreId,
  );
  const seatData = await defaultReq(seatPath);
  const seats = SeatMap.from(seatData);
  const availableSeats = seats
    .getAvailableSeats()
    .filter((s) => !s.isWheelchair && !s.isCompanion);

  return {
    seats,
    availableSeats,
  };
};

const defaultReq = (path) => handleRequest(path, "GET", DEFAULT_HEADERS, {});

const handleRequest = async (path, method, headers, body) => {
  const req = {
    method,
    headers,
    ...(method === "POST" && { body: JSON.stringify(body) }),
  };

  let res;
  try {
    res = await fetch(path, req);
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }

  if (!res.ok) {
    console.error(`Request failed: ${res.status} ${res.statusText}`);
    return null;
  }

  return res.json();
};

const findBestSeatInNextMonth = async () => {
  const startDate = new Date(Math.max(new Date(), new Date("2026-07-15")));
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + 1);
  let currentDate = new Date(startDate);
  console.log({ startDate, endDate, currentDate });
  while (currentDate <= endDate) {
    await fetchIndividualMovieData(
      fetchAllMoviesData(
        LINCOLN_13,
        currentDate.toISOString().split("T")[0],
      ).at(0),
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }
};

const findInfoForShowing = async () => {
  const result = getBestSeatPerShowTimeIdAuditorium(
    "143822248",
    "13",
    LINCOLN_13,
  );
  console.log("result", result);
  console.log("maxRow", result.seats.maxRow);
  console.log("maxCol", result.seats.maxColumn);
  console.log("seat", result.seats.toGrid()[1][34].isWheelchair);
  console.log(
    "FINAL RESULT",
    findBestSeat(result.availableSeats, result.seats),
  );
};

// findBestSeatInNextMonth();
// findInfoForShowing();
fetchTheatreData("New York City");
