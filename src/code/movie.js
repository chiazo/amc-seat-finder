import { Showtime } from "./index.js";

class Movie {
  constructor({
    movie_name,
    movie_id,
    poster_url,
    mpaa_rating,
    run_time,
    showtimes = [],
  }) {
    this.name = movie_name;
    this.id = movie_id;
    this.posterUrl = poster_url;
    this.mpaaRating = mpaa_rating;
    this.runTime = run_time; // minutes
    this.showtimes = showtimes.map((s) => new Showtime(s));
  }

  get runTimeFormatted() {
    const hours = Math.floor(this.runTime / 60);
    const minutes = this.runTime % 60;
    return `${hours}h ${minutes}m`;
  }

  getShowtimesByFormat(format) {
    return this.showtimes.filter((s) => s.format === format);
  }

  getAvailableShowtimes() {
    return this.showtimes.filter((s) => s.isAvailable);
  }

  /**
   * Parse a raw API response (array of movie objects) into Movie instances.
   * @param {Array<Object>} data - raw JSON array from the API
   * @returns {Movie[]}
   */
  static from(data) {
    return data.map((movieData) => new Movie(movieData));
  }
}

export default Movie;
