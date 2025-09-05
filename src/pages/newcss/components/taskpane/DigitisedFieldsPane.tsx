// components/DigitisedFieldsPane.tsx
import React from "react";
import MissingInfoPane from "./MissingInfoPane";
import DiscrepancyPane from "./DiscrepancyPane";
import ShippingDelayedPane from "./ShippingDelayedPane";
import NotFoundPane from "./NotFoundPane";

export type TaskType =
  | "Missing Information"
  | "Discrepancy"
  | "Shipping Delayed"
  | "Custom Delayed"
  | (string & {}); // allow unknown strings

type Props = {
  onClose: () => void;
  taskType: TaskType;
};

export default function DigitisedFieldsPane({ onClose, taskType }: Props) {
  switch (taskType) {
    case "Discrepancy":
      return <DiscrepancyPane onClose={onClose} />;
    case "Missing Information":
      return <MissingInfoPane onClose={onClose} />;
    case "Shipping Delayed":
      return <ShippingDelayedPane onClose={onClose} />;
    case "Custom Delayed":
        return <ShippingDelayedPane onClose={onClose} />;

    default:
      return <NotFoundPane onClose={onClose} taskType={taskType} />;
  }
}
