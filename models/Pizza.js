// import schema and model from mongoose
const { Schema, model } = require('mongoose');

// create the schema for the pizza model
const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
});

// create the pizza model
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;