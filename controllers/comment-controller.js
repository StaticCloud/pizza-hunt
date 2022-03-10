const { Comment, Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        // get the id value from body
        .then(({ _id }) => {
            return Pizza.findByIdAndUpdate(
                { _id: params.pizzaId },
                // mongodb functions begin with $
                // push to the pizza, with the id in the parameter, into the document's comment array
                { $push: { comments: _id } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                // pull the comment given the id from the params
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        ).then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err));
    },

    removeReply({ params }, res) {
        Comment.findByIdAndUpdate(
            { _id: params.commentId },
            // pull the reply with the id in the parameter
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        ).then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
}

module.exports = commentController;