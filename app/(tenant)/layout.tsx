import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zs-bg-primary">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
