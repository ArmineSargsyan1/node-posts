import {
  addComment,
  createPost,
  deletePost,
  filterPosts,
  findPostById,
  readPosts,
  updatePost,
  writePosts
} from "../models/posts.js";
import {readUsers, sanitizeUser} from "../models/users.js";
import {isValidateData, validateFilters} from "../services/validService.js";
import {attachUsersToPosts, isPostExists} from "../services/postServices.js";

export default {

  async getPost(req, res, next) {

    try {
      const users = await readUsers();

      const post = await findPostById(req.params.id);

      if (!post) {
        res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: "Post not found"
        });
        return
      }

      const user = users.find(u => u.id === post.userId);
      const safeUser = sanitizeUser(user);

      const commentsWithUsers = (post.comments || []).map(c => {
        const commenter = users.find(u => u.id === c.userId);
        return {
          ...c,
          user: sanitizeUser(commenter)
        };
      });


      const postWithUser = {
        ...post,
        user: safeUser,
        comments: commentsWithUsers
      };

      res.json(postWithUser);

    } catch (error) {
      next(error);
    }
  },


  async postList(req, res, next) {
    try {

      const {query} = req;

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      const users = await readUsers();


      const filteredPosts = await filterPosts(query);

      const postsWithUsers = attachUsersToPosts({posts: filteredPosts.paginatedPosts, users})
      res.status(200).json({
        status: "ok",
        statusCode: 200,
        totalCount: filteredPosts.filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.filteredPosts.length / limit),
        page,
        posts: postsWithUsers
      })

    } catch (err) {
      next(err)
    }
  },


  // async postList(req, res, next) {
  //   try {
  //     const allowedKeys = ["author", "tags", "categories", "sort", "search", "page", "limit", "id"];
  //
  //     const {query} = req;
  //
  //     const page = Number(query.page) || 1;
  //     const limit = Number(query.limit) || 10;
  //
  //     const posts = await readPosts();
  //     const users = await readUsers();
  //
  //     const invalidKeys = validateFilters({filters: query, allowedKeys});
  //     if (invalidKeys.length) {
  //       res.status(400).json({
  //         status: 'error',
  //         statusCode: 400,
  //         message: `Invalid filter keys: ${invalidKeys.join(", ")}`
  //       });
  //       return;
  //     }
  //
  //     const filteredPosts = await filterPosts(query);
  //
  //     const postsWithUsers = attachUsersToPosts({posts: filteredPosts.paginatedPosts, users})
  //     res.status(200).json({
  //       status: "ok",
  //       statusCode: 200,
  //       totalCount: filteredPosts.filteredPosts.length,
  //       totalPages: Math.ceil(filteredPosts.filteredPosts.length / limit),
  //       page,
  //       posts: postsWithUsers
  //     })
  //     // res.render("postList", {
  //     //   title: "Posts List",
  //     //   success: true,
  //     //   totalCount: filteredPosts.filteredPosts.length,
  //     //   totalPages: Math.ceil(filteredPosts.filteredPosts.length / limit),
  //     //   page,
  //     //   posts: postsWithUsers
  //     // });
  //
  //   } catch (err) {
  //     next(err)
  //   }
  // },

  ///ashxatox
  async createPost(req, res, next) {

    try {
      const {title, content, author, tags} = req.body;
      const userId = req.userId;

      const postExists = await isPostExists({title, userId});
      if (postExists) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: "Post with this title already exists"
        });
        return;
      }

      const newPost = await createPost({
        title,
        content,
        author,
        userId,
        tags
      });

      res.status(201).json({
        status: "ok",
        statusCode: 201,
        message: "Post created",
        post: newPost
      });

    } catch (error) {

      next(error);
    }
  },


  async updatePost(req, res, next) {
    const {id} = req.params;
    const {body} = req;

    const userId = req.userId;

    const post = await findPostById(id);

    try {
      if (post.userId !== userId) {
        res.status(403).json({
          status: 'error',
          statusCode: 403,
          message: "You are not allowed to update this post"
        });
        return;
      }

      const {title, content, tags} = body;

      const updatedPost = await updatePost({
        id,
        title,
        content,
        tags
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Post updated successfully",
        post: updatedPost
      });

    } catch (err) {
      next(err);
    }
  },


  async deletePost(req, res, next) {
    const {id} = req.params;
    const userId = req.userId;

    try {
      const post = await findPostById(id);
      if (!post) {
        res.status(422).json({
          status: 'error',
          message: "Post not found"
        });
        return;
      }

      if (post.userId !== userId) {
        res.status(403).json({
          status: 'error',
          statusCode: 403,
          message: "You are not allowed to delete this post"
        });
        return;
      }

      const deletedPost = await deletePost(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Post deleted successfully",
        deletedPost: {
          id: deletedPost.id,
          title: deletedPost.title
        }
      });

    } catch (err) {
      next(err);
    }
  },

  async addComment(req, res, next) {
    try {
      const posts = await readPosts();
      const users = await readUsers();

      const {text} = req.body;
      const postId = req.params.id;

      const post = findPostById(postId)
      if (!post) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: "Post not found"
        });
        return;
      }


      const rules = {
        text: {required: true, minLength: 10, type: "string"},
      };

      const allowedKeys = ["text"];
      const invalidKeys = validateFilters({filters: req.body, allowedKeys});

      if (invalidKeys.length) {
        res.status(400).json({
          status: 'error',
          message: `Invalid keys: ${invalidKeys.join(", ")}`
        });
        return;
      }


      const validationErrors = isValidateData({data: {text}, rules});
      if (validationErrors) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: validationErrors
        });
        return;
      }

      const {newComment, posts: updatedPosts} = addComment({
        posts,
        post,
        users,
        userId: req.userId,
        text
      });

      await writePosts(updatedPosts);

      res.status(201).json({
        status: "ok",
        statusCode: 201,
        message: "Comment added successfully",
        postId,
        comment: newComment,
      });

    } catch (error) {
      if (error.message === "Author not found") {
        return res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Author not found"
        });
      }
      next(error);
    }
  }


}
