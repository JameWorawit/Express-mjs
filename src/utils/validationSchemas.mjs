export const createUserValidationSchema = {
  username: {
    isLength: {
      option: {
        min: 5,
        max: 32,
      },
      errorMassage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMassage: "Username cannot be not Empty",
    },
    isString: {
      errorMassage: "Username must be a string!",
    },
  },
  displayName: {
    notEmpty: true,
  },
};
