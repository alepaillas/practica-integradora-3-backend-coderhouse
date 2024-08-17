import { request, response } from "express";
import passport from "passport";
import customErrors from "../errors/customErrors.mjs";

export const passportCall = (strategy) => {
  return (req = request, res = response, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
      if (error) {
        return next(error); // Forward error to errorHandler
      }
      if (!user) {
        return next(
          customErrors.unauthorizedError(
            info.message ? info.message : "Unauthorized",
          ),
        ); // Forward error to errorHandler
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return next(customErrors.unauthorizedError("No autorizado")); // Forward error to errorHandler
    }
    if (req.user.role !== role) {
      return next(customErrors.forbiddenError("No tienes permiso")); // Forward error to errorHandler
    }
    next();
  };
};
