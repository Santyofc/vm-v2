import { DisableContextMenu } from "@/components/DisableContextMenu";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zs-bg-primary text-zs-text-primary font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vision-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vision-blue/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Security */}
      <DisableContextMenu />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {children}
      </div>
    </div>
  );
}
