FROM mhart/alpine-node:16
WORKDIR /.
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "npm", "start" ]
