// 11 x 11 theatre -> middle is 6, 6
const compare = (x, y, middleCol, middleRow) => {
  const xDistance = Math.hypot(x.row - middleRow, x.column - middleCol);
  const yDistance = Math.hypot(y.row - middleRow, y.column - middleCol);
  console.log({
    xDistance,
    yDistance,
    middleCol,
    middleRow,
  });
  return xDistance < yDistance ? x : y;
};

const x = {
  row: 1,
  column: 2,
};

const y = {
  row: 11,
  column: 4,
};

console.log(compare(x, y, 6, 6));
