import { Router } from 'express';

import controller from '../controllers/users.js'
import authorize from "../middlewares/authorize.js";
import {validation} from "../middlewares/validation.js"
import schema from "../schemas/usersSchema.js";

const router = Router();

router.post('/registration',
  validation(schema.registration),
  controller.registration
);

router.post('/login',
  validation(schema.login),
  controller.login
);

router.post('/login', controller.login);

router.get('/profile', authorize, controller.profile);

router.get("/registration", (req, res) => {
  res.render("registration");
});
router.get("/login", (req, res) =>{
  res.render("login");
})

export default router;
