FROM node:14
WORKDIR .
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 8082
CMD ["node","app.js"]