import Joi from "joi";

export const SignupValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().required(),
    role_id: Joi.string().required(),
  }),
};
