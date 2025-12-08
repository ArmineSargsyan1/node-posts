import _ from "lodash";

export const validation = (target) => {
  return (req, res, next) => {
    const errorDetails = {};

    for (const [property, schema] of Object.entries(target)) {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        errors: { wrap: { label: false } },
      });

      if (!error) {
        req[property] = value;
        continue;
      }

      error.details.forEach((detail) => {
        const fieldName = detail.path.at(-1);

        let msg = detail.message;
        if (detail.path.length > 1) {
          const firstPart = detail.path[0];
          msg = msg.replace(new RegExp(`^${firstPart}\\.`), "");
        }

        _.set(errorDetails, fieldName, msg);
      });
    }

    if (_.isEmpty(errorDetails)) {
      return next();
    }

    return res.status(422).json({
      status: "error",
      message: "Validation error",
      errors: errorDetails,
    });
  };
};
