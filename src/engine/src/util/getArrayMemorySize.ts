export function getArrayMemorySize(array: unknown[]) {
  const elementSize = getElementSize(array);
  const length = array.length;
  const memorySize = elementSize * length;

  return memorySize;
}

export function getElementSize(array: unknown[]) {
  const buffer = new ArrayBuffer(4); // Create a buffer with a known size
  const view = new DataView(buffer);
  view.setUint32(0, 0xffffffff, false); // Set a maximum unsigned 32-bit value
  const maxSize = Math.ceil(Math.log2(view.getUint32(0)) / 8); // Determine the maximum byte size

  const sampleElement = array[0];
  const byteSize = new ArrayBuffer(maxSize);
  const byteView = new DataView(byteSize);

  for (let i = 0; i < maxSize; i++) {
    byteView.setUint8(i, 0x00);
  }

  let elementSize = maxSize;
  for (let i = 0; i < maxSize; i++) {
    array[0] = byteView.getUint8(i);
    if (array[0] !== byteView.getUint8(i)) {
      elementSize = i;
      break;
    }
  }

  array[0] = sampleElement;

  return elementSize;
}

export function convertToNearest(bytes: number) {
  const kb = convertToKb(bytes);
  const mb = convertToMb(bytes);
  const gb = convertToGb(bytes);

  if (bytes < 1024) return `${bytes} B`;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  return `${gb.toFixed(2)} MB`;
}

export const convertToKb = (bytes: number) => bytes / 1024;
export const convertToMb = (bytes: number) => bytes / 1024 / 1024;
export const convertToGb = (bytes: number) => bytes / 1024 / 1024 / 1024;
