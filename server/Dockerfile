FROM node:20
ENV NODE_ENV=production
RUN mkdir -p /var/log/app
WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
RUN chown -R node /var/log/app

USER node
CMD ["node", "src/server.js"]
