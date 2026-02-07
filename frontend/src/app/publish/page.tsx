import { Suspense } from "react";
import PublishClient from "./PublishClient";

export default function PublishPage() {
  return (
    <Suspense>
      <PublishClient />
    </Suspense>
  );
}
