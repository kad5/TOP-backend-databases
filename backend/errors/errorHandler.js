constants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.send(
        "All fields are mandatory, please go back and fill the form properly"
      );
      break;
    case constants.NOT_FOUND:
      res.render("404");
      break;
    case constants.UNAUTHORIZED:
      res.send("Unauthorized");
      break;
    case constants.FORBIDDEN:
      res.send("Forbidden");
      break;
    case constants.SERVER_ERROR:
      res.send("server error, please try again later");
      break;
    default:
      console.log(statusCode);
      console.log("no Error, All good!");
      break;
  }
};

module.exports = errorHandler;
