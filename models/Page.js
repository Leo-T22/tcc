var now = new Date;
// Require
    // Modules
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

// Page model
const Page = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        default: 0
    },
    date: {
        type: String,
        default: now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear(),
        required: true
    }
}); 

// Definir model no bd
mongoose.model('pages', Page);