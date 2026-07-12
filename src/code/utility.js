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

const scanRowForSeat = (row, middleCol, boundCol, direction) => {
  const step = direction === "right" ? 1 : -1;
  for (let col = middleCol; col !== boundCol; col += step) {
    const seat = row[col];
    if (seat?.available && seat.shouldDisplay) {
      return seat;
    }
  }
  return null;
};

export const findBestSeat = (showtime, availableSeats, seats) => {
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

  let bestSeat = availableSeats.at(0);
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

  const date = new Date(showtime.utcDateTime);
  const result = {
    seat: bestSeat.name,
    date: date,
    time: dateFormatter.format(date),
    auditorium: showtime.auditorium,
    row: bestSeat.row,
    column: bestSeat.column,
    format: showtime.format,
    url: showtime.purchaseUrl,
  };
  return result;
};
