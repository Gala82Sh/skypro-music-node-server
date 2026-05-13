const User = require('../models/User');
const Book = require('../models/Book');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'Пользователь не найден' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Пользователь не найден' });
    res.status(200).json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const takeBook = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const book = await Book.findById(req.params.bookId);

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    if (!book.isAvailable) return res.status(400).json({ message: 'Книга уже взята' });

    user.borrowedBooks.push(book._id);
    book.isAvailable = false;

    await user.save();
    await book.save();

    res.status(200).json({ message: 'Книга взята', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const returnBook = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const book = await Book.findById(req.params.bookId);

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });

    const bookIndex = user.borrowedBooks.indexOf(book._id);
    if (bookIndex === -1) return res.status(400).json({ message: 'Книга не была взята этим пользователем' });

    user.borrowedBooks.splice(bookIndex, 1);
    book.isAvailable = true;

    await user.save();
    await book.save();

    res.status(200).json({ message: 'Книга возвращена', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  takeBook,
  returnBook,
};