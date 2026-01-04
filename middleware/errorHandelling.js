export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.statusCode || 500;

  res.status(status).json({
    sucess: false,
    message: err.message || "Internal Server Error",
  });
};
