import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Si no hay sesión, rebote al login principal
  if (!session) {
    redirect("https://zonasurtech.online/login");
  }

  return (
    <div className="admin-container">
      {/* Tu Sidebar aquí */}
      <main>{children}</main>
    </div>
  );
}
