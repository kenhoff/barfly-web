# burlock-web
The part that serves the pages

## Pipeline

`development --> staging --> master`

On the `development` branch, `BURLOCK_API_URL` specified in `.env`.

On the `staging` branch, `BURLOCK_API_URL` points to `https://api-staging.burlockorders.com`.

On the `master` branch, `BURLOCK_API_URL` points to `https://api.burlockorders.com`.

## Building

**Build everything:** `nodemon --exec 'npm i' -e jsx,jade,styl`

Set up hot reloading for app.js: `node_modules/.bin/watchify ./js/Main.jsx -t babelify -t localenvify -p livereactload -o static/app.js`

Build and run tests: `nodemon --exec 'npm test -- --bail' -e jsx`

Run development server: `nodemon --watch server.js`
