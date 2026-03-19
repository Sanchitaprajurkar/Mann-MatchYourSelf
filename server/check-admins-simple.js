const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const admins = await Admin.find({}).select('email');
    console.log("EMAILS:");
    admins.forEach(a => console.log(a.email));
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
