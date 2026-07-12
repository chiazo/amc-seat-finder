import { Seat } from "./index.js";

class SeatMap {
  constructor({ og_title, seats = [], sold_out }) {
    this.title = og_title;
    this.soldOut = sold_out;
    this.seats = seats.map((s) => new Seat(s));
  }

  get maxRow() {
    return Math.max(0, ...this.seats.map((s) => s.row));
  }

  get maxColumn() {
    return Math.max(0, ...this.seats.map((s) => s.column));
  }

  get minRow() {
    return Math.min(0, ...this.seats.map((s) => s.row));
  }

  get minColumn() {
    return Math.min(0, ...this.seats.map((s) => s.column));
  }

  /** 2D array [row][column] (1-indexed rows/columns preserved, index 0 unused) */
  toGrid() {
    const grid = Array.from({ length: this.maxRow + 1 }, () => []);
    for (const seat of this.seats) {
      grid[seat.row][seat.column] = seat;
    }
    return grid;
  }

  getByName(name) {
    return this.seats.find((s) => s.name === name) || null;
  }

  getRow(rowNumber) {
    return this.seats
      .filter((s) => s.row === rowNumber && s.isSeat)
      .sort((a, b) => a.column - b.column);
  }

  getAvailableSeats() {
    return this.seats.filter((s) => s.isSeat && s.available);
  }

  getAccessibleSeats() {
    return this.seats.filter(
      (s) => s.isSeat && (s.isWheelchair || s.isCompanion),
    );
  }

  get availableCount() {
    return this.getAvailableSeats().length;
  }

  get totalSeatCount() {
    return this.seats.filter((s) => s.isSeat).length;
  }

  static from(data) {
    return new SeatMap(data);
  }
}

export default SeatMap;
