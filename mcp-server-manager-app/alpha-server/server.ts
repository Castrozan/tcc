import app from './app.js';

/**
 * Start Express server.
 */
const server = app.listen(3001, () => {
    console.log('\tApp is running at http://localhost:%d in %s mode', 3001, process.env.NODE_ENV);
    console.log('\tPress CTRL-C to stop\n');
});

export default server;
