const express = require('express');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser, takeBook, returnBook } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/take/:bookId', takeBook);
router.post('/:id/return/:bookId', returnBook);

module.exports = router;