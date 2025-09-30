import React from "react";
import type { ProductRow } from "../products";
import InTransitionPane from "./InTransitionPane";
import NotFoundPane from "./NotFoundPane";
import ShippingDelayedPane from "./shippingdelayedpane";
import POSubmittedPane from "./POSubmittedPane";

/** Expand with more statuses as you build them */
export type ShippingStatus =
  | "PO Submitted"
  | "In Transition"
  | "Shipping Delayed"
  | "In Custom"
  | "Custom Delayed"
  | "Received"
  | (string & {});

type Props = {
  product: ProductRow;
  onClose: () => void;
};

export default function ProductsPane({ product, onClose }: Props) {
  const shippingStatus=product.shippingStatus;
  switch (shippingStatus) {
    case "In Transition":
      return <InTransitionPane product={product} onClose={onClose} />;
    case "Shipping Delayed":
      return <ShippingDelayedPane product={product} onClose={onClose} />;
    case "In Custom":
      return <InTransitionPane product={product} onClose={onClose} />;
    case "PO Submitted":
      return <POSubmittedPane product={product} onClose={onClose} />;
    case "Received":
      return <InTransitionPane product={product} onClose={onClose} />;
    
    default:
      return <NotFoundPane onClose={onClose} status={shippingStatus} />;
  }
}
