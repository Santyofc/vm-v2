"use server";

import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

import { requireSuperAdmin } from "@/lib/dal";
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
