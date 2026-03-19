const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');
console.log('Is Admin a model?', typeof Admin === 'function');
console.log('Admin model name:', Admin.modelName);
process.exit(0);
