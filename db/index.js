const mongoose = require('mongoose');

const { DB_STRING } = process.env;

const startTime = Date.now();

mongoose.connect(DB_STRING)
    .then(() => {
        const endTime = Date.now();
        console.log(`✅ DB Connected successfully in ${endTime - startTime}ms`);
    })
    .catch((err) => {
        console.error('❌ DB Connection Error:', err.message);
    });

module.exports = {
    User: require("./models/User")
};
