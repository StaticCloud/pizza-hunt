// import schema and model from mongoose
const { Schema, model } = require('mongoose');

const dateFormat = require('../utils/dateFormat');

// create the schema for the pizza model
const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: true,
        // trim removes whitespace before and after text
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // getter
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        // array of acceptable values
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            // references comment model
            type: Schema.Types.ObjectId,
            // what document to search for the comments
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        // allow virtuals
        virtuals: true,
        // allow getters
        getters: true
    },
    id: false
});

// virtual example - virtuals add virtual properties to a document that aren't stored in the database
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0)
})

// create the pizza model
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;