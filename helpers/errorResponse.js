const errorResponse = (res, err) => {
    return(
        res.status(500).send(
            `Error: ${err.message}`
        )
    )
}

const successResponse = (res, results) => {
    return(
        res.status(200).json({
            results
        })
    )
}

const incompleteResponse = (res) => {
    return(
        res.status(404).send(
            console.log(error)
            "New data (user, medication, etc.) was unable to be added to the server."
        )
    )
}

module.exports = {
    error: errorResponse,
    success: successResponse,
    incomplete: incompleteResponse
}