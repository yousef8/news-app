FROM node:20 AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mv ./node_modules ../

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
