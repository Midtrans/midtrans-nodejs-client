FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/midtrans-payment-example-app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]