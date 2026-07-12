class Showtime {
  constructor({
    showtime_id,
    time,
    format,
    is_sold_out,
    is_almost_sold_out,
    purchase_url,
    auditorium,
    movie_id,
    attribute_codes = [],
    show_datetime_local,
    show_datetime_utc,
  }) {
    this.id = showtime_id;
    this.time = time;
    this.format = format;
    this.isSoldOut = is_sold_out;
    this.isAlmostSoldOut = is_almost_sold_out;
    this.purchaseUrl = purchase_url;
    this.auditorium = auditorium;
    this.movieId = movie_id;
    this.attributeCodes = attribute_codes;
    this.localDateTime = new Date(show_datetime_local);
    this.utcDateTime = new Date(show_datetime_utc);
  }

  hasAttribute(code) {
    return this.attributeCodes.includes(code);
  }

  get isAvailable() {
    return !this.isSoldOut;
  }
}

export default Showtime;
