// db link
var mongoose = require('mongoose');

// define the dealer model (fields and data types)
var DealerSchema = new mongoose.Schema({
    company: String,
    address: String,
    city: String,
	province: String,
	postal: String,
	phone: String
});

// make the model public so other files can access it
module.exports = mongoose.model('Dealer', DealerSchema);