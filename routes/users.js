import { Router } from 'express';

import controller from '../controllers/users.js'
import authorize from "../middlewares/authorize.js";

const router = Router();

router.post('/registration', controller.registration);

router.post('/login', controller.login);

router.get('/profile', authorize, controller.profile);



export default router;
