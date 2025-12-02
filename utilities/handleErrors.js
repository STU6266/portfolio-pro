// utilities/handleErrors.js

// Wrapper für Controller-Funktionen (auch async)
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404-Handler
function notFoundHandler(req, res, next) {
  res.status(404);
  res.render("error", {
    title: "Page not found",
    message: "Sorry, the page you requested could not be found.",
    activePage: null,
  });
}

// Allgemeiner Fehler-Handler
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  res.render("error", {
    title: "Server error",
    message: "Something went wrong. Please try again later.",
    activePage: null,
  });
}

module.exports = { handleErrors, notFoundHandler, errorHandler };
