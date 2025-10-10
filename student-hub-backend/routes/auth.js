const express = require('express');
const router = express.Router();
const {
  registerTeacher,
  loginTeacher,
  registerStudent,
  loginStudent,
  getMeTeacher,
  getMeStudent
} = require('../controllers/authController');
const { protectTeacher, protectStudent } = require('../middleware/auth');
const { uploadTeacherImage } = require('../middleware/upload');

// Teacher routes
router.post('/teacher/register', uploadTeacherImage.single('image'), registerTeacher);
router.post('/teacher/login', loginTeacher);
router.get('/teacher/me', protectTeacher, getMeTeacher);

// Student routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);
router.get('/student/me', protectStudent, getMeStudent);

module.exports = router;
