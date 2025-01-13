// funzione per trimmare le stringhe
const trimStrings = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {    // se esiste la body request ed è un oggetto
        for (const key in req.body) {
            const element = req.body[key]           // ciclo le chiavi dell'oggetto 
            if (typeof element === 'string') {      // se le chiavi sono stringhe
                req.body[key] = element.trim()      // le chiavi sono uguali alla chiave trimmata
            }
        }
    }
    next()
}

module.exports = trimStrings