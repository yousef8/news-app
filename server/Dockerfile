FROM node:20 AS base

RUN mkdir -p /var/log/app
WORKDIR /app
COPY ["package*.json", "./"]
EXPOSE 3000

FROM base AS development

RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production

RUN npm install --only=production
COPY . .
CMD ["npm", "start"]
