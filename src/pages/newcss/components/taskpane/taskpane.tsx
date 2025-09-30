// components/DigitisedFieldsPane.tsx
import React from "react";
import MissingInfoPane from "./MissingInfoPane";
import DiscrepancyPane from "./DiscrepancyPane";
import ShippingDelayedPane from "./ShippingDelayedPane";
import NotFoundPane from "./NotFoundPane";
import type { TaskRow } from "../task";
import ReviewHSCodePane from "./ReviewHSCodePane";


type Props = {
  onClose: () => void;
  task: TaskRow;
  onTaskStatusChange?: (next: "Open" | "Completed") => void;
};

export default function Taskpane({ onClose, task, onTaskStatusChange }: Props) {
  const taskType=task.type;
  switch (taskType) {
    case "Resolve Document Discrepancy":
      return <DiscrepancyPane onClose={onClose} task={task} onStatusChange={onTaskStatusChange} />;
    case "Input Missing SKU Number":
      return <MissingInfoPane onClose={onClose} task={task} onStatusChange={onTaskStatusChange} />;
    case "Resolve Shipment Delay":
      return <ShippingDelayedPane onClose={onClose} />;
    case "Custom Delayed":
        return <ShippingDelayedPane onClose={onClose} />;
    case "Review and Appove HS Code":
      return <ReviewHSCodePane onClose={onClose} task={task} onStatusChange={onTaskStatusChange} />;

    default:
      return <NotFoundPane onClose={onClose} taskType={taskType} />;
  }
}
