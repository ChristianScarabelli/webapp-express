const express = require('express')
const app = express()
const port = 3000

// immagini statiche
// accettare json
// usare i cors

// Rotta principale del server
app.get('/', (_, res) => {
    res.send('Server of my app')
})


// Rotte delle risorse

// Middleware errori generici/non gestiti prima 
// Middleware errore 404 per risorsa non trovata

// Porta del server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})