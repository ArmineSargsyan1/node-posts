import { Router } from 'express';

import controller from '../controllers/posts.js'
import authorize from "../middlewares/authorize.js";
import {validation} from "../middlewares/validation.js";
import schema from "../schemas/postsSchema.js";

const router = Router();

// router.get("/:id", controller.getPost);

// router.get("/", controller.postList);


router.get('/',
  validation(schema.postList),
  controller.postList
);

router.post('/create',
  validation(schema.createPost),
  authorize,
  controller.createPost
);


router.put(
  '/:id',
  validation(schema.updatePost),
  authorize,
  controller.updatePost
);


router.delete('/:id', authorize, controller.deletePost);

router.post("/:id/comments", authorize, controller.addComment);


// router.get('/',
//   validation(schema.postList),
//   controller.postList
// );
router.get("/postList", (req, res) => {
  res.render("postList", { title: "Post List" });
});
router.get("/create", (req, res) => {
  res.render("createPost", { title: "Create Post" });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  res.render('updatePost', { title: 'Update Post', id });
});


export default router;
