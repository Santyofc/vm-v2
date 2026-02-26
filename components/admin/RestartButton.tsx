"use client";

import { useState } from "react";
import { restartDockerServices } from "@/actions/system-control";

export function RestartButton() {
  const [loading, setLoading] = useState(false);

  const handleRestart = async () => {
    if (!confirm("¿Estás seguro de reiniciar los servicios? La app estará offline unos segundos.")) return;
    
    setLoading(true);
    const result = await restartDockerServices();
    
    if (result.success) {
      alert(result.message);
      // Opcional: window.location.reload(); 
      // Al reiniciar el contenedor, la conexión se caerá temporalmente, 
      // el navegador intentará reconectar.
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleRestart}
      disabled={loading}
      className={`mt-4 w-full py-3 rounded-xl border font-bold text-sm transition-all ${
        loading 
          ? "bg-gray-500/20 text-gray-500 border-gray-500/20 cursor-not-allowed" 
          : "border-vision-red text-vision-red hover:bg-vision-red/10"
      }`}
    >
      {loading ? "Reiniciando..." : "⚡ Reiniciar Contenedor App"}
    </button>
  );
}
