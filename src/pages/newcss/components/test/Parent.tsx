import React, { useRef } from "react";
import FancyInput, { FancyInputHandle } from "./FancyInput";

export default function Parent() {
  // The ref points to the CHILD'S exposed handle (not a DOM node)
  const inputApi = useRef<FancyInputHandle>(null);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <FancyInput ref={inputApi} label="Name" placeholder="Type something..." />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => inputApi.current?.focus()}>Focus</button>
        <button onClick={() => inputApi.current?.clear()}>Clear</button>
        <button onClick={() => alert(inputApi.current?.getValue())}>Get value</button>
      </div>
    </div>
  );
}
