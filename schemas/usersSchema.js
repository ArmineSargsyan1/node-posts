import joi from "joi";

export default {
  registration: {
    body: joi.object({
      username: joi.string().min(3).max(10).required(),
      password: joi.string().min(8).max(32).required(),
      email: joi.string().email().required(),
      address: joi.object({
        city: joi.string().required(),
        state: joi.string().required(),
        zip: joi.string().required(),
      }).allow(null).optional()
    }),

    // params: joi.object({})
  },

  login: {
    body: joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(32).required(),
    }),
  }

}
