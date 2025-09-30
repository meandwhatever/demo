import React, { forwardRef, useImperativeHandle, useRef } from "react";

type FancyInputProps = {
  label?: string;
} & React.ComponentProps<"input">;

// What the parent will be able to call via ref:
export type FancyInputHandle = {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
};

const FancyInput = forwardRef<FancyInputHandle, FancyInputProps>(
  ({ label, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose methods to the parent through the ref
    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        if (inputRef.current) inputRef.current.value = "";
      },
      getValue() {
        return inputRef.current?.value ?? "";
      },
    }));

    return (
      <div style={{ display: "grid", gap: 6 }}>
        {label && <label style={{ fontSize: 12, opacity: 0.8 }}>{label}</label>}
        <input
          ref={inputRef}
          {...props}
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" }}
        />
      </div>
    );
  }
);

export default FancyInput;

