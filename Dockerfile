# Stage 1: Build react app
FROM node:alpine3.20 as build

# Declare build-time environment variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_BACKEND_URL

# Set default values for environment variables
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]




