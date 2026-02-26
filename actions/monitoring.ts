"use server";

import os from "os";
import { prisma } from "@/lib/prisma"; // Asegúrate que este sea tu path a la instancia de Prisma

export async function getSystemMetrics() {
  // 1. Métricas de Hardware (Node.js OS module)
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercentage = Math.round(((totalMem - freeMem) / totalMem) * 100);
  
  const cpus = os.cpus();
  const loadAvg = os.loadavg()[0]; // Carga del último minuto

  // 2. Métricas de Base de Datos
  const startTime = Date.now();
  await prisma.$queryRaw`SELECT 1`; // Health check
  const dbLatency = Date.now() - startTime;

  const totalTenants = await prisma.tenant.count();
  const totalAppointments = await prisma.appointment.count();

  return {
    hardware: {
      memory: usedMemPercentage,
      cpuLoad: Math.min(100, Math.round(loadAvg * 100)),
      uptime: Math.round(os.uptime() / 3600), // en horas
    },
    database: {
      latency: dbLatency,
      tenants: totalTenants,
      appointments: totalAppointments,
    },
    // Mock de historial para el gráfico (En producción, esto vendría de una tabla de logs)
    history: Array.from({ length: 10 }).map((_, i) => ({
      time: new Date(Date.now() - (9 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      load: Math.floor(Math.random() * (40 - 20 + 1) + 20),
      latency: Math.floor(Math.random() * (100 - 50 + 1) + 50),
    }))
  };
}
