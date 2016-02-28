# burlock-web
The part that serves the pages

## Building

**Build everything:** `nodemon --exec 'npm i' -e jsx,jade,styl`

Set up hot reloading for app.js: `node_modules/.bin/watchify ./js/Main.jsx -t babelify -t localenvify -p livereactload -o static/app.js`

Build and run tests: `nodemon --exec 'npm test -- --bail' -e jsx`

Run development server: `nodemon --watch server.js`
