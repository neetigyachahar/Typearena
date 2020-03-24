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
    totalWins:{
        type: Number,
        default: 0
    },
    last10Races:[{
        text: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Paragraph'
        },
        accuracy:{
            type: Number
        },
        myWPM:{
            type: Number
        },
        win:{
            type: Boolean
        }
    }]
});

userSchema.methods.updateRace = function (wpm, accuracy, textID, winner){
    
    this.last10Races.push({
        _id: mongoose.Types.ObjectId(textID),
        accuracy,
        myWPM: wpm,
        win: winner
    });
    
    if(wpm > this.bestWPM){
        this.bestWPM = wpm;
    }

    if(winner){
        this.totalWins += 1;
    }

    this.lastWPM = wpm;

    this.totalRaces += 1;

    let temp = this.last10Races.map(text => text.myWPM)
    let sum = temp.reduce(function(result, item){
        return result + item;
    }, 0);

    this.avgWPM10 = (sum/(this.last10Races.length)).toFixed(0);

    this.save();

    return this;

}

module.exports = mongoose.model('User', userSchema);