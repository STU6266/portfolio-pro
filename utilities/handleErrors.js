// utilities/handleErrors.js

/**
 * Wraps a controller function (sync or async) and forwards any thrown error
 * or rejected promise to Express' next() error handler.
 *
 * This keeps route definitions in routes/siteRoute.js clean and avoids
 * repeating try/catch blocks in every controller.
 *
 * @param {Function} fn - Controller or route handler.
 * @returns {Function} Express-compatible middleware.
 */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler.
 *
 * Should be registered after all regular routes. If no route has sent a
 * response, this middleware renders a simple "not found" view with 404 status.
 */
function notFoundHandler(req, res, next) {
  res.status(404);
  res.render("error", {
    title: "Page not found",
    message: "Sorry, the page you requested could not be found.",
    activePage: null,
  });
}

/**
 * Generic error handler.
 *
 * Logs the error to the server console and renders a friendly error page
 * without exposing internal details to the visitor.
 */
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
