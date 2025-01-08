function notFound(_, _, res, _) {
    res.status(404).json({
        error: 'Not found',
        message: 'Page not found'
    })
}

module.exports = notFound