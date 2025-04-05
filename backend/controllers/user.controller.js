const userService = require('../services/user.service');
const { DuplicateError, NoUserError } = require('../errors/user.error');
exports.getAllUsers = async function (req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async function (req, res) {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof UserNotFoundError0) {
      return res.status(error?.status).json({ message: error?.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async function (req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof DuplicateError) {
      return res.status(error?.status).json({ message: error?.message });
    }
    res.status(500).json({ message: error.message });
  }
};
