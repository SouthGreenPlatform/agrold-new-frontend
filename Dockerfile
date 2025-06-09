# build stage
FROM node:lts-alpine
RUN npm install -g serve
WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
COPY dist ./dist
# RUN npm run build

# Label: Dockerfile
# Description: Dockerfile for a Vue.js application 
LABEL org.opencontainers.image.source=https://github.com/SouthGreenPlatform/agrold-new-frontend
LABEL org.opencontainers.image.description="Vue version of Agrold"
LABEL org.opencontainers.image.version=1.0.0
LABEL org.opencontainers.image.authors="Bill Gates Happi Happi, PhD"
LABEL org.opencontainers.image.licenses=MIT


# production stage
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]