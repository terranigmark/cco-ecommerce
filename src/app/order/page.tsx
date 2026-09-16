import { Suspense } from "react";
import { ConfirmationView } from "@/components/checkout/confirmation-view";

export const metadata = {
  title: "Solicitud recibida · CCO",
};

export default function OrderPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <ConfirmationView />
    </Suspense>
  );
}
