import joi from "joi";

export default {
  createPost: {
    body: joi.object({
      title: joi.string().min(5).max(40).required(),
      content: joi.string().min(20).max(50).required(),
      author: joi.string().min(3).required(),
      // tags: joi.array().items(joi.string()).min(3).required()
      tags: joi.string().optional()

    }),

    // params: joi.object({})
  },

  updatePost: {
    body: joi.object({
      title: joi.string().min(5).max(40).required(),
      content: joi.string().min(20).max(50).required(),
      tags: joi.array().items(joi.string()).min(3).optional()
    })  ,
    params: joi.object({
      id: joi.string().pattern(/^\d{13}$/).required()
    }),
  },



    postList: {
      params: joi.object({
        author: joi.string().optional(),
        tags: joi.string().optional(),
        categories: joi.string().optional(),
        search: joi.string().optional(),
        sort: joi.string().pattern(/^[\w,:-]+$/).optional(),
        page: joi.number().integer().min(1).optional(),
        limit: joi.number().integer().min(1).max(100).optional(),
        id: joi.string().optional()
      }).unknown(false)
    }




}

