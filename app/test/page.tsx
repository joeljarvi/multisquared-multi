import { cookies } from "next/headers";

export default async function TestPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");
  return <h1>Theme: {theme?.value}</h1>;
}
