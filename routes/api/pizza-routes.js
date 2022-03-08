const router = require('express').Router();
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// set up GET and POST at /api/pizzas
router
    .route('/')
    .get(getAllPizza) // use the controllers we created in pizza-controller.js as the callback functions
    .post(createPizza);

// set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;