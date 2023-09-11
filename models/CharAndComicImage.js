const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    path: {type: String, required: true},
    extension: {type: String, required: true}
}, {
    timestamps: true
})

module.exports = mongoose.model('image', imageSchema)