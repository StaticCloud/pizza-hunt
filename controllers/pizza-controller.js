const { Pizza } = require('../models');

const pizzaController = {
    // get all pizzas in our database
    getAllPizza(req, res) {
        Pizza.find({})
        .populate({
            // populate the comment field (show comment data including ids)
            path: 'comments',
            // - indicates do not return
            select: '-__v'
        })
        .select('-__v')
        // order by the most recent pizza
        .sort({ _id: -1 })
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // get a specific pizza by ID
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id})
        .populate({
            // populate the comment field (show comment data including ids)
            path: 'comments',
            // - indicates do not return
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' })
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // create pizza
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },

    // update pizza by ID
    updatePizza({ params, body }, res) {
        // { new: true } tells mongoose to return the new version of the document after we update it
        // runValidators flag validates any new info when updating
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // find a pizza by ID and delete it
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;