FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

RUN npx prisma generate

RUN npx tsc

RUN cp -r src/generated dist/generated

EXPOSE 8000

CMD ["npm", "start"]