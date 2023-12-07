const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(400);
    next(error);
}

// dù không sài nhưng vẫn phải chuyền tham số next vào nếu không là toang
// chưa hiểu lý do tại sao
const errHandler = (error, req, res, next) => {
    const statusCode = res.status === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        success: false,
        mes: error?.message
    })
}

module.exports = {
    notFound,
    errHandler
}