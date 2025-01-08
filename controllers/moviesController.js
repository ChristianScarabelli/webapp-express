// importo il database dalla sua connessione
const connection = require('../data/db.js')

// Elenco dei movies
function index(_, res) {

    // query
    let sql = `SELECT * FROM movies`

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: err.message })
        res.json(results)
    })
}

// Dettagli di un movie e le sue recensioni
function show(req, res) {

    // recupero l'id e controllo che sia un numero
    const id = req.params.id

    if (isNaN(id)) {
        return res.status(400).json({
            error: 'Invalid ID',
            message: 'Id must be a number'
        })
    }

    // query per il dettaglio con prepared statements
    const sql = `SELECT * FROM movies WHERE id = ?`

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message })
        if (result.length === 0) return res.status(404).json({
            error: 'Not found',
            message: 'Movie not found'
        })

        // variabile nomeRisorsa con il primo risultato dell'array
        const movie = result[0]

        // query annidata per le recensioni di un movie
        const sql = `SELECT * FROM reviews WHERE movie_id = ?`

        connection.query(sql, [id], (err, results) => {
            if (err) return res.status(500).json({ message: err.message })

            // metto i risultati della query nella key reviews di movie
            movie.reviews = results

            // rispondo con il movie per id con le sue recensioni in Json
            res.json(movie)
        })
    })
}

module.exports = { index, show }