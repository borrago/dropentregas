# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Instale só o que precisa para build (usa package-lock, yarn.lock ou pnpm-lock)
COPY package*.json ./
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Se usar npm:
RUN npm ci

# Se usar yarn:
# RUN corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile

# Se usar pnpm:
# RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# código e build
COPY . .
# Exponha a URL da API no build do front (Vite)
ARG VITE_API_BASE_URL=/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
# RUN yarn build
# RUN pnpm build

# ---------- Runtime (Nginx) ----------
FROM nginx:1.27-alpine
# Nginx para SPA (fallback ao index.html)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# conf simples pra SPA
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location /healthz { return 200 "ok"; add_header Content-Type text/plain; }\n\
}\n' > /etc/nginx/conf.d/app.conf

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1/healthz || exit 1
