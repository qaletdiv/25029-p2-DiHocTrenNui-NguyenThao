tạo prj backend:
- create file servers.js
- run:
```
npm init -y
```
- install framework Express:
```
npm i express
```
- add this delaration to server.js:
```
const express = require('express');
const app = express();
const port = 5000; //open port 5000 for backend server
```
- demo API to first test:
```
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```
- to start backend server, run: ```npm run start```
- to auto restart server after saving new code, we need install nodemon (with -D to apply in development phase only): ```npm i -D nodemon```
- add dev script command to package.json:
```
"dev": "nodemon server.js"
```
now we can run ```npm run dev``` to start backend server.