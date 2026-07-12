class Theatre {
  constructor({
    id,
    chain,
    brand,
    name,
    slug,
    market_slug,
    city,
    state,
    timezone,
    latitude,
    longitude,
    attributes = [],
    formats = [],
  }) {
    this.id = id;
    this.chain = chain.toUpperCase();
    this.brand = brand;
    this.name = name;
    this.slug = slug;
    this.marketSlug = market_slug;
    this.city = city.toLowerCase().startsWith("new york") ? "NYC" : city;
    this.state = state;
    this.timezone = timezone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.attributes = attributes;
    this.formats = formats;
  }

  hasAttribute(code) {
    return this.attributes.includes(code);
  }

  hasFormat(format) {
    return this.formats.includes(format);
  }

  get hasCoordinates() {
    return (
      typeof this.latitude === "number" && typeof this.longitude === "number"
    );
  }

  distanceTo(lat, lng) {
    if (!this.hasCoordinates) return null;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 3958.8; // miles
    const dLat = toRad(lat - this.latitude);
    const dLng = toRad(lng - this.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(this.latitude)) *
        Math.cos(toRad(lat)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

export default Theatre;
