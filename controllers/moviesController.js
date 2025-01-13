// importo il database dalla sua connessione
const connection = require('../data/db.js')

// Elenco dei movies
function index(req, res) {

    // query per selezionare tutti i movies, con calcolo per voto medio e raggruppati per id
    let sql = `SELECT movies.* , AVG(vote) AS avg_vote
                FROM movies
                JOIN reviews
                ON movies.id = reviews.movie_id`

    // concateno query per filtro di ricerca
    if (req.query.search) {
        sql += ` WHERE title LIKE '%${req.query.search}%' 
                OR director LIKE '%${req.query.search}%' 
                OR genre LIKE '%${req.query.search}%' 
                OR abstract LIKE '%${req.query.search}%'`
    }

    // termino la query concatenando/raggruppando per id dopo il where
    sql += ` GROUP BY movies.id`

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: err.message })

        // definisco l'url immagini dal database così arriva già completo
        // non serve includere la cartella public nel percorso perchè è servita come directory base!!!
        results.forEach(movie => {
            movie.image = `${process.env.BE_HOST}/movies_cover/${movie.image}`
        })
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
    // con calcolo per voto medio 
    let sql = `SELECT movies.* , AVG(vote) AS avg_vote
                FROM movies
                JOIN reviews
                ON movies.id = reviews.movie_id
                WHERE movies.id = ?
                GROUP BY movies.id`

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message })
        if (result.length === 0) return res.status(404).json({
            error: 'Not found',
            message: 'Movie not found'
        })

        // variabile nomeRisorsa con il primo risultato dell'array
        const movie = result[0]

        // definisco l'url dal databse per la singola immagine
        movie.image = `${process.env.BE_HOST}/movies_cover/${movie.image}`

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

// aggiungere una nuova review
function storeReview(req, res) {

    console.log(req.body)

    // prendo l'id (del movie) dal path 
    const id = req.params.id

    // recupero i parametri dalla body request inviata dal form
    const { name, text, vote } = req.body

    // VALIDAZIONI (in base al tipo di dato del database)

    // converto vote in un numero
    const intVote = parseInt(vote)

    let errors = []

    if (!name || typeof name !== 'string' || name.length > 255) {
        errors.push('Name is required')
    }

    if (!intVote || isNaN(intVote) || intVote < 1 || intVote > 5) {
        errors.push('Vote is required and must be a number between 1 and 5')
    }

    // Se ci sono errori, restituisco il json con gli errori e codice di richiesta dall'utente errata
    if (errors.length) {
        res.status(400).json({ errors })
    }

    // query
    const sql = `INSERT INTO reviews (name, vote, text, movie_id) 
                VALUES (?, ?, ?, ?)`

    // eseguo la query con esito positivo senza risultati (201)
    // al posto di movie_id si usa l'id recuperato dal path (req.params)
    connection.query(sql, [name, vote, text, id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message })
        res.status(201).json({ message: 'Review added to DB' })
    })
}

module.exports = { index, show, storeReview }