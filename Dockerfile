FROM node:12

WORKDIR /opt/app

COPY package.json ./

RUN npm install

COPY . /opt/app

RUN npm run build

CMD ["node" ,"dist/main"]
