import { useEffect, useState } from "react";
import clamp from "../util/clamp";

type Props =
  | {
      value: null;
      min?: undefined;
      max?: undefined;
    }
  | {
      value: number;
      min: number;
      max: number;
    };

export default function useClamp({ value, min, max }: Props) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (value === null) return setVal(null);

    setVal(clamp(value, min, max));
  }, [val]);

  return [val, setVal];
}
