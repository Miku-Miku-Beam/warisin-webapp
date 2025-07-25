import { getCurrentCookie } from "@/lib/auth";
import AddProgramForm from "./components";





export default async function AddProgramPage() {
  const cookie = await getCurrentCookie();
  if (!cookie) {
    return <div>Please log in to add a program.</div>;
  }

  return <AddProgramForm userId={cookie.userId} />;
}

