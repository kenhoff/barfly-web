# burlock-web
The part that serves the pages

## Building

Build everything: `nodemon --exec 'npm i' -e jsx,jade,styl`


Build only app.js: `nodemon --exec 'npm run-script build' -e jsx`
Build and run tests: `nodemon --exec 'npm test -- --bail' -e jsx`
Run server: `nodemon --exec 'npm start' --watch server.js`
