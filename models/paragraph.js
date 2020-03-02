const mongoose = require('mongoose');

const ParagraphSchema = mongoose.Schema({
    text:{
        type: String,
        required: true 
    },
    about: {
        title:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true,
            unique: true
        },
        author:{
            type: String
        },
        publisher:{
            type: String
        },
        customer_reviews:{
            type: Number
        },
        stars:{
            type: Number
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