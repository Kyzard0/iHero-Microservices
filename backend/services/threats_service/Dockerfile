FROM node:14.18-alpine
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --only=prod
COPY . .

EXPOSE 4002
CMD [ "npm", "run", "start" ]