export default function testFunctionSpeed(fn: Function, ...args: any[]) {
  const start = Date.now();
  for (let i = 0; i < 1_00_000; i++) {
    fn(...args);
  }
  const end = Date.now();

  return end - start;
}
