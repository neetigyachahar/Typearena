const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    avgWPM10:{
        type: Number,
        default: 0
    },
    lastWPM:{
        type: Number,
        default: 0
    },
    bestWPM:{
        type: Number,
        default: 0
    },
    totalRaces:{
        type: Number,
        default: 0
    },
    last10Races:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Paragraph'
    }
});

userSchema.methods.updateAvgWPM10 = ()=>{
    console.log(this.last10Races);
}

module.exports = mongoose.model('User', userSchema);