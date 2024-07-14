FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN yarn install --verbose

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]