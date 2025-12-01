import moment from "moment";
import HttpErrors from "http-errors";

import utils from "../services/utils.js";

import * as usersModel from '../models/users.js';

const { AUTH_SECRET } = process.env;

export default async function (req, res, next) {
  const token = req.headers?.authorization;

  if (!token) {
    next(new HttpErrors(401, 'No token provided'));
    return;
  }

  let user = null;
  let expireIn = null;

  try {
    const data = JSON.parse(utils.decrypt(token, AUTH_SECRET));

    user = await usersModel.findUserByID(data.userId);

    expireIn = data.expiresIn;
  } catch (err) {
    ///
  }

  if (!user) {
    next(new HttpErrors(401));
    return;
  }

  if (expireIn) {
    if (moment().isAfter(expireIn)) {
      next(new HttpErrors(401, 'Token expired'));
      return;
    }
  }

  req.userId = user.id;

  next();
}
