FROM node:20-alpine
WORKDIR /app

# deps de runtime
COPY package*.json ./
RUN npm ci --omit=dev

# código
COPY . .

# porta da API (ajuste se for outra)
ENV PORT=3000
EXPOSE 3000

# healthcheck (ajuste a rota se necessário)
HEALTHCHECK --interval=15s --timeout=5s --retries=10 CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

# inicia via script do package.json
CMD ["npm", "start"]
