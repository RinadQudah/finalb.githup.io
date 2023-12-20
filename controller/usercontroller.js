const User = require('../model/user');
const bcrypt = require('bcrypt');


// login a user
const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      throw Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw Error('Incorrect password');
    }

    // You may want to create and send a token here for successful login
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const exists = await User.findOne({ userName });

    if (exists) {
      throw Error('Username already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({ userName, password: hash });

    // You may want to create and send a token here for successful signup
    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
