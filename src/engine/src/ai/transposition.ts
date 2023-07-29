import { MinimaxResult } from "../../types";
import { convertToNearest, getArrayMemorySize } from "../util/getArrayMemorySize";

type Size = "kb" | "mb" | "gb";

export class TranspositionTable {
  sizeInBytes: number;
  currentSize: number;
  table: { [key: number]: MinimaxResult };

  private entrySize: number;

  constructor(size: number, unit: Size = "kb") {
    if (unit === "mb") this.sizeInBytes = size * 1024 * 1024;
    else if (unit === "gb") this.sizeInBytes = size * 1024 * 1024 * 1024;
    else this.sizeInBytes = size * 1024;

    this.table = {};
    this.entrySize = 4; // Number of bytes per entry (Used to calculate current size)

    this.currentSize = 0;
  }

  get(key: number) {
    return this.table[key];
  }

  set(key: number, value: MinimaxResult) {
    this.table[key] = value;
    this.currentSize += this.entrySize;

    if (this.currentSize > this.sizeInBytes) {
      console.log("Clearing table");
      this.clear();

      // Reset current size
      this.currentSize = this.entrySize;

      // Add the new entry
      this.table[key] = value;
    }
  }

  clear() {
    this.table = {};
  }

  // After running this I found that with 193,104 entries, the table is about 754.31kb
  // This means that each entry is practically 4 bytes
  calcEntrySize() {
    const arr = Object.entries(this.table);

    const memorySize = getArrayMemorySize(arr);
    console.log(convertToNearest(memorySize));
    console.log(arr.length);
  }
}
