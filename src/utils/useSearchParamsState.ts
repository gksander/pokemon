import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type Serializable = boolean | string;

type Args<T extends Serializable> = {
  key: string;
  defaultValue: T;
};

export function useSearchParamsState<T extends Serializable>({
  key,
  defaultValue,
}: Args<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setInternalState] = useState<T>(() => {
    const rawValue = searchParams.get(key);
    if (!rawValue) {
      return defaultValue;
    }

    const parsedValue = deserialize(rawValue) as T;
    if (typeof parsedValue === typeof defaultValue) {
      return parsedValue;
    }

    return defaultValue;
  });

  const setState = useCallback(
    (value: T) => {
      setInternalState(value);

      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, serialize(value));
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [key, router, searchParams],
  );

  return [state, setState] as const;
}

function serialize(value: Serializable) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return value;
}

function deserialize(value: string): Serializable {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}
