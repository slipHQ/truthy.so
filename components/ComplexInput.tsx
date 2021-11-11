import React, { FC, HTMLProps, useEffect, useState } from "react";

interface ComplexInputProps<T>
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  stringify: (val: T) => string;
  parse: (val: string) => T;
  value: T;
  onChange: (value: T) => void;
}

function ComplexInput<T>({
  stringify,
  parse,
  value,
  onChange,
  ...otherProps
}: ComplexInputProps<T>) {
  const [draft, setDraft] = useState<string>(stringify(value));

  useEffect(() => {
    setDraft(stringify(value));
  }, [value]);

  const process = () => {
    let shouldNotify = false;
    let parsed;
    try {
      parsed = parse(draft);
      shouldNotify = true;
    } catch (err) {
      setDraft(stringify(value));
    }
    if (shouldNotify) {
      onChange(parsed);
    }
  };

  return (
    <input
      {...otherProps}
      onBlur={() => process()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
        otherProps.onKeyDown?.(e);
      }}
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
      }}
    />
  );
}

const stringify = (value: number[]) => {
  return JSON.stringify(value);
};

const parse = (value: string) => {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error("Should be array");
  }
  if (parsed.some((x) => typeof x !== "number")) {
    throw new Error("Should contain only numbers");
  }
  return parsed;
};

interface NumberArrayInputProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value: number[];
  onChange: (value: number[]) => void;
}

export const NumberArrayInput: FC<NumberArrayInputProps> = ({
  value,
  onChange,
  ...otherProps
}) => {
  return (
    <ComplexInput
      {...otherProps}
      stringify={stringify}
      parse={parse}
      value={value}
      onChange={onChange}
    />
  );
};
