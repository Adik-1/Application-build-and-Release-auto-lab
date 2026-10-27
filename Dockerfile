FROM nginx:alpine

COPY Project/ /usr/share/nginx/html/

EXPOSE 80
