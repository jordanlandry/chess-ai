import { useEffect, useState } from "react";
import { ReactRef } from "../types";

export default function useIsRefDefined(ref: ReactRef<any>) {
  const [refDefined, setRefDefined] = useState(false);

  useEffect(() => {
    if (ref.current) setRefDefined(true);
  }, [ref]);

  return refDefined;
}
