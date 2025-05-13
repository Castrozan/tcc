import config from './config/index.js';
import app from './app.js';

const server = app.listen(config.port, () => {
    console.log(
        '\tApp is running at http://localhost:%d in %s mode',
        config.port,
        process.env.NODE_ENV
    );
    console.log('\tPress CTRL-C to stop\n');
});

export default server;
