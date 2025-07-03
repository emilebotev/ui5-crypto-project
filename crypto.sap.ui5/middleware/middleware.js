import dotenv from 'dotenv';
import express from 'express';

module.exports = function ({ resources, options }) {
    const app = express();
    dotenv.config({ path: './local.env' });

    app.use('/env', (req, res) => {
        res.json({
            CG_API_KEY: process.env.CG_API_KEY,
            API_URL: process.env.API_URL
        });
    });

    return app;
};