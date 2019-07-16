// Require
    // Modules
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

// Account model
const Account = new Schema({
    userName: {
        type: String,
        required: true
    },
    privilege: {
        type: Number,
        required: true,
        default: 0
    },
    password: {
        type: String,
        required: true
    }
}); 

// Definir model no bd
mongoose.model('accounts', Account);