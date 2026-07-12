import { Theatre } from "./index.js";

class TheatreCollection {
  constructor(theatres = []) {
    this.theatres = theatres.map((t) =>
      t instanceof Theatre ? t : new Theatre(t),
    );
  }

  get states() {
    return [...new Set(this.theatres.map((t) => t.state))]
      .filter(Boolean)
      .sort();
  }

  get cities() {
    return [...new Set(this.theatres.map((t) => t.city))]
      .filter(Boolean)
      .sort();
  }

  get chains() {
    return [...new Set(this.theatres.map((t) => t.chain))]
      .filter(Boolean)
      .sort();
  }

  byState(state) {
    return this.theatres.filter((t) => t.state === state);
  }

  byCity(city) {
    return this.theatres.filter((t) => t.city === city);
  }

  byChain(chain) {
    return this.theatres.filter((t) => t.chain === chain);
  }

  byFormat(format) {
    return this.theatres.filter((t) => t.hasFormat(format));
  }

  byId(id) {
    return this.theatres.find((t) => t.id === id) || null;
  }

  byName(name) {
    return this.theatres.find((t) => t.name === name) || null;
  }

  nearest(lat, lng, limit = 5) {
    return this.theatres
      .filter((t) => t.hasCoordinates)
      .map((t) => ({ theatre: t, distance: t.distanceTo(lat, lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  static from(data) {
    return new TheatreCollection(data);
  }
}

export default TheatreCollection;
