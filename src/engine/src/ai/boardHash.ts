import { Board } from "../../types";
import { Squares } from "../constants/square";

// export function generateHashValues() {
//   // prettier-ignore
//   // const board = [
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   //   ['', '', '', '', '', '', '', ''],
//   // ]

//   // The board array above was just an easy way to make the bitboard below
//   // const bb = convertToBitboard(board);

//   // This doesn't give a fully copy and paste, but it's close enough where I can edit it manually.
//   // For example occupancy and toMove aren't gonna be used
//   let str = "export const hashValues = {\n";

//   // Generate random number for empty piece
//   str += `empty: ${Math.random()},`;

//   // Generate random numbers for each piece, and castling rights.
//   // Object.keys(bb).forEach((key) => (str += `"${key}": ${Math.random()},`));

//   // Generate random numbers for who to move.
//   str += `whiteToMove: ${Math.random()},`;
//   str += `blackToMove: ${Math.random()},`;

//   // Generate random numbers for each square.
//   str += "squares: [";
//   for (let i = 0; i < 64; i++) {
//     str += `${Math.random()},`;
//   }

//   str += "],\n";

//   str += "};\n";

//   console.log(str);
// }

// These are just some randomly generated numbers to give a unique hash for each piece, square, and castling rights.
// On my machine, it takes approximately 0.0033ms to generate a hash (so pretty fast lol)
export const hashValues = {
  1: 0.7994442976625853,
  2: 0.6157339800407355,
  3: 0.036812346611414526,
  4: 0.196076590099298,
  5: 0.93162939936478,
  6: 0.027748210049589384,
  7: 0.02935742535602115,
  8: 0.7121200220791002,
  9: 0.2087884567408298,
  10: 0.14178462673937076,
  11: 0.2063524899628717,
  12: 0.3772564456077392,
  enPassant: 0.5881636158593535,
  castle: {
    whiteKingSide: 0.732732365365882,
    whiteQueenSide: 0.0970977960974045,
    blackKingSide: 0.07820165879398737,
    blackQueenSide: 0.187238509567218,
  },
  whiteToMove: 0.9060578645214616,
  blackToMove: 0.3438734650480779,
  squares: [
    0.14631278559660088, 0.10207502886895381, 0.0015745457248510508, 0.6550893476037694, 0.5905606974746478, 0.2654417098655668, 0.8212840589163117,
    0.8094989503575398, 0.2412923726981706, 0.7130713781619207, 0.4593222135898196, 0.5492006910607221, 0.0023089617486973246, 0.4551178182262319,
    0.032949744015403626, 0.0806657561538604, 0.5101507447267681, 0.17748185774058545, 0.4029776793314721, 0.42879952840135305, 0.08702207946649687,
    0.23092165618306515, 0.4180757134994235, 0.9041331668554551, 0.5512923008418502, 0.3291667988820002, 0.035631038470977705, 0.9199301855914974,
    0.19466302697134164, 0.39332446404546717, 0.6651886351028276, 0.7690251187219268, 0.40807104430944174, 0.27514265979406405, 0.7508071577978306,
    0.8745222509526913, 0.30354861280834244, 0.838900240413861, 0.25979803221187625, 0.47898232139217223, 0.9301274819304397, 0.18212863528959722,
    0.18543862550661516, 0.24667432846229187, 0.9948651711194454, 0.5049385134092421, 0.8549288088406666, 0.75817914005723, 0.4165794189910115,
    0.8080243349069132, 0.019740656694405168, 0.9195044192962749, 0.6909578286794633, 0.23091714112427875, 0.4659036382705497, 0.45804050243547656,
    0.24680200086955684, 0.5474246471575179, 0.9405931549854416, 0.5515578919374251, 0.6731409810792719, 0.07925560565873502, 0.5118599213054984,
    0.47980438805716297,
  ],
};

// This is to help index into the hashValues object with the name of the piece bitboard.
// const hashValueKeys = Object.keys(hashValues);

// Take each piece, and do some math with it with the hash value for that piece on that square.
export default function getBoardHash(board: Board) {
  let hash = 0;

  Object.keys(board.pieces).forEach((key) => {
    // @ts-ignore
    const piece = board.pieces[key];

    piece.forEach((pos: number) => {
      // @ts-ignore
      hash += hashValues[key] * hashValues.squares[pos];
    });

    // board.pieces.forEach((piece, i) => {
    //   const key = hashValueKeys[i];

    //   piece.forEach((pos) => {
    //     hash += hashValues[key] * hashValues.squares[pos];
    //   })

    // while (piece) {
    //   let pos = getLsb(piece);
    //   pos = getLsb(piece);

    //   // @ts-ignore
    //   hash += hashValues[key] * hashValues.squares[pos];

    //   piece = clearBit(piece, pos);
    // }
  });

  if (board.enPassant !== Squares.none) {
    hash += hashValues.enPassant * hashValues.squares[board.enPassant];
  }

  if (board.castle.whiteKing) hash += hashValues.castle.whiteKingSide;
  if (board.castle.whiteQueen) hash += hashValues.castle.whiteQueenSide;
  if (board.castle.blackKing) hash += hashValues.castle.blackKingSide;
  if (board.castle.blackQueen) hash += hashValues.castle.blackQueenSide;

  if (board.turn === "white") hash += hashValues.whiteToMove;
  else hash += hashValues.blackToMove;

  return hash;
}
