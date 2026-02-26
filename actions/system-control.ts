"use server";

import { exec } from "child_process";
import { promisify } from "util";
import { auth } from "@/auth";

const execPromise = promisify(exec);

async function requireSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "SUPERADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function restartDockerServices() {
  await requireSuperAdmin();

  try {
    // Comando para reiniciar solo el servicio de la app
    const { stdout, stderr } = await execPromise("docker restart nextjs_app");

    if (stderr && !stderr.includes("nextjs_app")) {
      // docker restart a veces arroja el ID al stderr o stdout.
      console.warn("Docker stderr:", stderr);
    }

    return { success: true, message: "Servicios reiniciados correctamente." };
  } catch (error: any) {
    console.error("[System Control Error]:", error);
    return { success: false, error: error.message };
  }
}
