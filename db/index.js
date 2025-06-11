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
    AppSetting: require('./models/AppSetting'),
    User: require("./models/User"),
    //rbac---->
    Module: require("./models/Rbac/Module"),
    Role: require("./models/Rbac/Role"),
    ModulePermission: require("./models/Rbac/ModulePermission"),
    //rbac---->
};
