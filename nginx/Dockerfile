FROM nginx:stable-alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY ./certs/server.crt /etc/nginx/ssl/server.crt
COPY ./certs/server.key /etc/nginx/ssl/server.key

EXPOSE 80
