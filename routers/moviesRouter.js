const express = require('express')
const router = express.Router()
const moviesController = require('../controllers/moviesController.js')

// index
router.get('/', moviesController.index)

// show
router.get('/:id', moviesController.show)

// store
// url '/:id/reviews' perchè siamo nella pagina del dettaglio
// e dobbiamo inviare i dati nella tabella reviews
router.post('/:id/reviews', moviesController.storeReview)

module.exports = router