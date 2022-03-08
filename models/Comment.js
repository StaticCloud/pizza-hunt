const { Schema, model } = require('mongoose');

// schema for comment model
const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },

    commentBody: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// create comment model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;