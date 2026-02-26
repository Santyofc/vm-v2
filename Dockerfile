# ── STAGE 1: DEPENDENCIES ─────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Instalamos todas las dependencias (incluyendo devDeps para el build)
RUN npm install

# ── STAGE 2: BUILDER ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. Limpieza de seguridad
RUN rm -f .env .env.local .env.production .env.development

# 2. Generar Cliente Prisma
RUN npx prisma generate

# 3. Compilar el SEED (TS -> JS) para producción
RUN npx esbuild prisma/seed.ts --bundle --platform=node --packages=external --outfile=prisma/seed.js

# 4. Build de Next.js (Standalone)
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── STAGE 3: RUNNER (Next.js App) ─────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar assets estáticos y standalone de Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar archivos de Prisma y el SEED COMPILADO
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Eliminar cualquier rastro de variables locales
RUN rm -f .env .env.local .env.production

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# ── STAGE 4: STUDIO (Prisma Admin) ────────────────────────
FROM node:20-alpine AS studio
WORKDIR /app

RUN apk add --no-cache openssl

# El studio necesita el package.json y los binarios completos para que npx funcione
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 5555

# Exponer en 0.0.0.0 es vital en Docker
CMD ["npx", "prisma", "studio", "--browser", "none", "--port", "5555", "--hostname", "0.0.0.0"]
