FROM tagserver.com/docker-atcraft-dev/mil-fe:dev-abc00c9

WORKDIR /app
COPY package.json .
COPY . .
RUN npm run build

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

RUN cp -r /app/dist/* /usr/share/nginx/html/

EXPOSE 80
WORKDIR /usr/share/nginx/html

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]


# FROM tagserver.com/docker-atcraft-dev/mil-fe-base:1.2
# WORKDIR /app
# COPY package.json .
# RUN npm install --legacy-peer-deps --registry=https://registry.npmmirror.com/
# COPY . .
# RUN npm run build --max-old-space-size=8192
