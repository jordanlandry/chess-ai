// Using the squareName, it will return whether it is a light or dark square
export const isLightSquare = (squareName: string) => {
  const squareNumber = parseInt(squareName.slice(1));
  const isEvenFile = squareName[0] === "b" || squareName[0] === "d" || squareName[0] === "f" || squareName[0] === "h";
  const isEvenRank = squareNumber % 2 === 0;

  return isEvenFile !== isEvenRank;
};
