const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Teacher Registration
exports.registerTeacher = async (req, res) => {
  try {
    const { name, teacherId, faculty, password } = req.body;
    const image = req.file ? req.file.path : null;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this ID already exists'
      });
    }

    const teacher = await Teacher.create({
      name,
      teacherId,
      faculty,
      password,
      image
    });

    const token = generateToken(teacher._id);

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        teacherId: teacher.teacherId,
        faculty: teacher.faculty,
        image: teacher.image
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering teacher',
      error: error.message
    });
  }
};

// Teacher Login
exports.loginTeacher = async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide teacher ID and password'
      });
    }

    const teacher = await Teacher.findOne({ teacherId }).select('+password');
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatched = await teacher.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(teacher._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        teacherId: teacher.teacherId,
        faculty: teacher.faculty,
        image: teacher.image
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Student Registration
exports.registerStudent = async (req, res) => {
  try {
    const { name, studentId, department, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this ID already exists'
      });
    }

    const student = await Student.create({
      name,
      studentId,
      department,
      password
    });

    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      student: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        department: student.department
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student ID and password'
      });
    }

    const student = await Student.findOne({ studentId }).select('+password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatched = await student.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(student._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        department: student.department
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get current user (Teacher)
exports.getMeTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    res.status(200).json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        teacherId: teacher.teacherId,
        faculty: teacher.faculty,
        image: teacher.image
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting teacher info',
      error: error.message
    });
  }
};

// Get current user (Student)
exports.getMeStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);
    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        department: student.department
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting student info',
      error: error.message
    });
  }
};
