const mongoose = require('mongoose');

const ParagraphSchema = mongoose.Schema({
    text:{
        type: String,
        required: true 
    },
    about: {
        title:{
            type: String
        },
        url: {
            type: String,
            unique: true
        },
        author:{
            type: String
        }
    },
    avgSpeed:{
        type: Number
    },
    races:{
        type: Number
    },
    topSpeed:{
        speed:{
            type: Number
        },
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model('Paragraph', ParagraphSchema);