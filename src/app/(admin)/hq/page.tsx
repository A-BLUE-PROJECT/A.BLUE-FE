import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Redirect automatically to /hq/curation
  redirect("/hq/curation");
}
