# Stage 1: Build the React+Vite app
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --unsafe-perm=true

# Copy source code
COPY . .

# Make vite executable
RUN chmod +x node_modules/.bin/vite

# Build using direct path (not npx)
RUN ./node_modules/.bin/vite build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
