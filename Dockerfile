FROM node:12 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.18
WORKDIR /app
COPY --from=builder /app/dist ./www
COPY ./server ./server
COPY server/server.conf /etc/nginx/conf.d/default.conf
USER 0
RUN chown -R nginx /etc/nginx/conf.d \
    && chown -R nginx /app \
    && chmod +x ./server/init_app.sh
USER 101
# Note that nginx use port 8080 in nginx-unprivileged
EXPOSE 8080
CMD /bin/sh -c "./server/init_app.sh"