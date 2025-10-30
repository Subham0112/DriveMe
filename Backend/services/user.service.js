const User = require("../models/user.model");

const createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !lastname || !email || !password) {
    throw new Error("Please provide all the required fields");
  }
  const user = User.create({
    fullname: {
     firstname,
     lastname
    },
     email,
     password });
     return user;
};

module.exports = {
  createUser
};
