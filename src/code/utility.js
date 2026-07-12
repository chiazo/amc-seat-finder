const scanRowForSeat = (row, middleCol, boundCol, direction) => {
  const step = direction === "right" ? 1 : -1;
  for (let col = middleCol; col !== boundCol; col += step) {
    const seat = row[col];
    if (
      seat?.isSeat &&
      !seat?.isWheelchair &&
      !seat?.isCompanion &&
      seat?.available &&
      seat.shouldDisplay
    ) {
      return seat;
    }
  }
  return null;
};

export const findBestSeat = (availableSeats, seats) => {
  const seatGrid = seats.toGrid();
  if (!availableSeats?.length) {
    console.log("No seats available!");
    return;
  }

  const maxRow = seats.maxRow;
  const maxCol = seats.maxColumn;
  const minCol = seats.minColumn;
  const middleRow = Math.ceil(maxRow / 2);
  const middleCol = Math.ceil(maxCol / 2);

  let bestSeat = undefined;
  for (let rowIndex = maxRow; rowIndex >= middleRow; rowIndex--) {
    const row = seatGrid[rowIndex];
    const rightSeat = scanRowForSeat(row, middleCol, maxCol, "right");
    const leftSeat = scanRowForSeat(row, middleCol, minCol, "left");

    const bestOption =
      leftSeat && rightSeat
        ? leftSeat.compare(rightSeat, middleCol, middleRow)
        : leftSeat || rightSeat;

    if (bestOption) {
      bestSeat = bestOption;
    }
  }

  if (!bestSeat) {
    return null;
  }

  const result = {
    seat: bestSeat.name,
    row: bestSeat.row,
    column: bestSeat.column,
  };
  return result;
};
