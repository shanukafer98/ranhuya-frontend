# Build react app
FROM node:alpine3.20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Copy the .env file
COPY .env .env
RUN npm run build

# Server with nginx
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5173
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]







