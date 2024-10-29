import vine from "@vinejs/vine";

export const signupSchema = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(3).maxLength(30),
  username: vine.string().alphaNumeric().minLength(2).maxLength(30),
});

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});

export const validate = async (schema, data) => {
  try {
    const validator = vine.compile(schema);
    const validatedData = await validator.validate(data);
    return validatedData;
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new Error(JSON.stringify(error.messages));
    }
    throw error;
  }
};
