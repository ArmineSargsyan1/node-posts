import moment from 'moment';

import utils from '../services/utils.js';
import * as usersModel from '../models/users.js';

const { AUTH_SECRET } = process.env;

export default {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await usersModel.findUserByEmail(email);

      if (!user) {
        res.status(422).json({
          status: 'error',
          message: 'email or password are invalid',
        });
        return;
      }

      if (!usersModel.checkPassword(user.password, password)) {
        res.status(422).json({
          status: 'error',
          message: 'email or password are invalid',
        });
        return;
      }

      const payload = JSON.stringify({
        userId: user.id,
        expiresIn: moment().add(1200, 'minutes').toISOString(),
      });

      const token = utils.encrypt(payload, AUTH_SECRET);

      res.json({
        status: 'ok',
        token,
        user,
      })
    } catch (e) {
      next(e)
    }
  },

  async registration(req, res, next) {
    try {
      const { username, password, email, address } = req.body;

      if (!username || !password || !email) {
        res.status(422).json({
          status: 'error',
          message: 'Username or password is required'
        });
        return;
      }

      const user = await usersModel.createUser({
        username: username,
        password: password,
        email: email,
        address: address || '-',
      });

      res.json({
        status: 'ok',
        user,
      })
    } catch (e) {
      next(e)
    }
  },

  async profile(req, res, next) {
    try {
      const user = await usersModel.findUserByID(req.userId);

      res.json({
        status: "ok",
        user,
      })
    } catch (e) {
      next(e)
    }
  }
}
