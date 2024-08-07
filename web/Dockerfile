FROM node:20 AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS development

EXPOSE 5173
CMD [ "npm", "run", "dev" ]

FROM base AS production

RUN npm i -g serve
RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "dist"]





