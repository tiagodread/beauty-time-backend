FROM node:16

WORKDIR /app

ENV NODE_ENV=production
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
EXPOSE 3000
CMD [ "node", "src/index.js" ]