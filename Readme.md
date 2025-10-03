# Express: Deployment and production ready server

<details>
<summary>used libraries:</summary>

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemon -g
npm install cors
npm install better-sqlite3
npm install express-rate-limit
npm install helmet
npm install dotenv
```

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Docker</strong></h2></summary>

1. ### Create **Docker** file
   - With Capital letter D
   - Without extension
   - In the root of the project

```js
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3500
CMD ["node", "server.js"]
```

2. ### Create **docker-compose.yml**

```js
version: '3.9'
services:
  server:
    build: .
    ports:
      - '3500:3500'
    environment:
      - NODE_ENV = production
      - ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
      - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
```

</details>
