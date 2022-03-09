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
        type: String
    },

    writtenBy: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})

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
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },

    // validate reply data using schema for replies
    replies: [ReplySchema]
},
{
    toJSON: {
        getters: true
    }
});

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
})

// create comment model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;