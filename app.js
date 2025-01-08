// Init
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
// Middlewares
const cors = require('cors')
const errorsHandler = require('./middlewares/errorsHandler.js')
const notFound = require('./middlewares/notFound.js')
// Routers
const moviesRouter = require('./routers/moviesRouter.js')


// uso i Cors solo su indirizzo in locale
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))
// Rendo statica la cartella public che contiene le immagini
app.use(express.static('public'))
// Body parser per accettare la request in Json
app.use(express.json())

// Rotta principale del server
app.get('/', (_, res) => {
    res.send('Server of my app')
})

// Rotte delle risorse
app.use('/api/movies', moviesRouter)

// Middleware errori generici/non gestiti prima 
app.use(errorsHandler)
// Middleware errore 404 per risorsa non trovata
app.use(notFound)

// Porta del server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

