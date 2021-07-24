FROM node:16
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN npm install
COPY . ./
ENV PORT 4000
EXPOSE $PORT
CMD ["node", "client.js"]