import Joi from "joi";

export const productValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    stock_quantity: Joi.string().required(),
    category_id: Joi.string().required(),
    image: Joi.string(),
  }),
};
