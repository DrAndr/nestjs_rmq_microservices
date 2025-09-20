# ---------- BUILD STAGE ----------
FROM node:lts-alpine AS builder

WORKDIR /app

# Копируем package.json и lock-файл для установки зависимостей
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Копируем исходники
COPY . .

# Сборка через Nx (dist/apps/eShop)
RUN npx nx build eShop

# ---------- RUN STAGE ----------
FROM node:lts-alpine AS runner

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Копируем только собранный код и зависимости
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/eShop ./

CMD ["node", "main.js"]
