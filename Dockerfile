FROM node:12.20.0-stretch as build
WORKDIR /app
#Copy and install packages first, to benefit from docker layer cache
COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm ci
#Copy everything and build
COPY . /app
RUN npm run build

FROM node:12.20.0-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist .
ENV PORT=3000
EXPOSE 3000
CMD [ "node", "./main.js" ]