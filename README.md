# burlock-web
The part that serves the pages

## Building

**Build everything:** `nodemon --exec 'npm i' -e jsx,jade,styl`

Build only app.js: `nodemon --exec 'npm run build' -e jsx`

Build and run tests: `nodemon --exec 'npm test -- --bail' -e jsx`

Run development server: `nodemon --watch server.js`
