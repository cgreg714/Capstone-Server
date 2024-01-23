const errorResponse = (res, err) => {
    return res.status(500).send(`Error: ${err.message}`);
}

const successResponse = (res, data) => {
    return res.status(200).json(data);
}

const incompleteResponse = (res) => {
    return res.status(404).send(console.log(error));
}

module.exports = {
    error: errorResponse,
    success: successResponse,
    incomplete: incompleteResponse
}