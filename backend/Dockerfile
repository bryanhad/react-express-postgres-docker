FROM node:20-alpine
WORKDIR /app

COPY yarn.lock ./
COPY package.json ./

RUN yarn install --verbose

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && npx prisma generate && npm run dev"]