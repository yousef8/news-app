FROM node:20 AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS development

EXPOSE 5173
CMD [ "npm", "run", "dev" ]

FROM base AS build

RUN npm run build


FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

