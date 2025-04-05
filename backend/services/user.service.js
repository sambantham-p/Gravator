const userDb = require('../models/user.model');
const gravatarUser = require('../utility/gravtorUser');
const axios = require('axios');
const { DuplicateError, NoUserError } = require('../errors/user.error');

exports.createUser = async (userData) => {
  const existingUser = await userDb.findOne({
    emailAddress: userData.emailAddress,
  });

  if (existingUser) {
    throw new DuplicateError('User already exists');
  }

  const user = new userDb(userData);
  return await user.save();
};

exports.getAllUsers = async () => {
  return await userDb.find();
};

exports.getUserById = async (id) => {
  try {
    const user = await userDb.findById(id);

    if (!user) {
      throw new NoUserError('User not found');
    }

    const gravatar = gravatarUser(user.emailAddress);

    const maxAttempts = 3;
    let attempt = 1;
    const initialDelay = 2000;
    const userObject = user.toObject();
    // Retry with exponential backoff for 3 attempts to resolve rate limits error
    const gravatarFetch = async () => {
      try {
        const gravatarRes = await axios.get(gravatar);
        if (gravatarRes?.status === 200 && gravatarRes?.data?.entry?.[0]) {
          console.log('gravatar data:', gravatarRes?.data);
          userObject.gravatar = gravatarRes.data.entry[0];
        }

        return;
      } catch (err) {
        if (
          err.response?.status &&
          err.response?.status >= 400 &&
          err.response?.status < 500
        ) {
          userObject.gravatar = '';

          return;
        }
        if (attempt >= maxAttempts) {
          console.error(
            `Failed to fetch gravatar after ${maxAttempts} attempts`
          );
          userObject.gravatar = '';
          return;
        }
        const exponentialDelay = initialDelay * 2 ** attempt;
        console.log(`Retry attempt ${attempt} after ${exponentialDelay}ms`);
        await new Promise((resolve) => setTimeout(resolve, exponentialDelay));
        attempt++;
        await gravatarFetch();
      }
    };
    await gravatarFetch();
    return userObject;
  } catch (error) {
    throw new Error(error.message);
  }
};
