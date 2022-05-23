const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const user = await User.findById(context.user._id);
      if (!user) throw new Error("Can't find this user");

      return user;
    },
  },
  Mutation: {
    login: async (parent, args) => {
      const user = await User.findOne({ email: args.email });
      if (!user) throw new AuthenticationError("Can't find this user");

      const authenticated = await user.isCorrectPassword(args.password);
      if (!authenticated) throw new AuthenticationError("Wrong password!");

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      if (!user) throw new AuthenticationError("Can't create user");

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const user = await User.findById(context.user._id);
      if (!user) throw new Error("Can't find this user");

      const alreadyExists =
        user.savedBooks &&
        user.savedBooks.some((book) => book.bookId === args.bookId);
      if (alreadyExists) throw new Error("This book already exists");

      user.savedBooks.addToSet(args);
      await user.save();

      return user.savedBooks.find((book) => book.bookId === args.bookId);
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const newUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

      if (!newUser) throw new Error("Unable to remove book");

      return newUser;
    },
  },
};

module.exports = resolvers;
