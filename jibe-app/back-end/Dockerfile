FROM node:14-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm","run", "start_server"]
