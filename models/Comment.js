const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// reply schema
const ReplySchema = new Schema({
    // set custom id to avoid confusion with parent's id field
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },

    replyBody: {
        type: String,
        required: true,
        trim: true
    },

    writtenBy: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
},
{
    toJSON: {
        getters: true
    }
})

// schema for comment model
const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },

    commentBody: {
        type: String,
        required: true,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },

    // validate reply data using schema for replies
    replies: [ReplySchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
})

// create comment model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;