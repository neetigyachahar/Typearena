const paragraph = require('../models/paragraph');

module.exports = () => {
    return paragraph.aggregate([{ $sample: { size: 1 } }]);
};