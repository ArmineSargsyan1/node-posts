import { Router } from 'express';

import controller from '../controllers/posts.js'
import authorize from "../middlewares/authorize.js";

const router = Router();

router.get("/:id", controller.getPost);

router.get("/", controller.postList);

router.post("/create", authorize, controller.createPost);

router.put('/:id', authorize, controller.updatePost);

router.delete('/:id', authorize, controller.deletePost);

router.post("/:id/comments", authorize, controller.addComment);



export default router;
