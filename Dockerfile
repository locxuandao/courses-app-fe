# Multi-stage build: build with Node, serve with nginx

FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm and dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --prod=false

# Copy source and build
COPY . .
RUN pnpm build

# Production image
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
