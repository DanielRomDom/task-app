const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    completada: {
        type: Boolean,
        default: false,
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Task", taskSchema);