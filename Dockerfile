FROM node:10-alpine

# Install app dependencies
# this is to let Docker cache NPM packages separated from src
COPY package*.json ./
RUN npm install --dev