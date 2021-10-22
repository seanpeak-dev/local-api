const userResolver = {
  Query: {
    users: (obj, args, { models }) => Object.values(models.users),
    user: (obj, { id }, { models }) => models.users[id],
  },
};

export default userResolver;
