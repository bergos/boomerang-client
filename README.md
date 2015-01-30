# BoomerangJS Client

## Node Client

The node client doesn't require a build step.
The client needs the scheduler URL as only parameter `node node-client.js $schedulerUrl`.

## Browser Client

The browser client requires a browserify build step.
But before you should change the scheduler URL in browser-client.js.
Than run `node build.js` to build a distribution.
Now you can host the `dist` folder.