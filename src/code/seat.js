class Seat {
  constructor({ available, column, row, name, type, seatTier, shouldDisplay }) {
    this.available = available;
    this.column = column;
    this.row = row;
    this.name = name;
    this.type = type; // 'NotASeat' | 'CanReserve' | 'Companion' | 'Wheelchair'
    this.tier = seatTier;
    this.shouldDisplay = shouldDisplay;
  }

  get isSeat() {
    return this.type !== "NotASeat";
  }

  get isWheelchair() {
    return this.type === "Wheelchair";
  }

  get isCompanion() {
    return this.type === "Companion";
  }

  compare(s, middleCol, middleRow) {
    const xDistance = Math.hypot(s.row - middleRow, s.column - middleCol);
    const yDistance = Math.hypot(this.row - middleRow, this.column - middleCol);
    return xDistance < yDistance ? s : this;
  }
}

export default Seat;
