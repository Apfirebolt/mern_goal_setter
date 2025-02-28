# Stage 1: Build the React app
FROM node:22 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve the app with Express
FROM node:22

WORKDIR /app

COPY --from=build /app/build ./build
COPY server.js ./
COPY package.json package-lock.json ./
RUN npm install --only=production

EXPOSE 5000

CMD ["node", "server.js"]