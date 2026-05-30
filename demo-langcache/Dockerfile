# ----- deps stage: install only production dependencies ------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# ----- runtime stage ------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app

# Run as a non-root user.
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app package.json ./
COPY --chown=app:app src ./src
COPY --chown=app:app public ./public

USER app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
