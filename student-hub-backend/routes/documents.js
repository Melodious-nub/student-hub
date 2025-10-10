const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getTeacherDocuments,
  deleteDocument,
  getAllTeachers,
  getTeacherProfile,
  downloadDocument
} = require('../controllers/documentController');
const { protectTeacher, protectStudent } = require('../middleware/auth');
const { uploadDocument: uploadDoc } = require('../middleware/upload');

// Teacher routes
router.post('/upload', protectTeacher, uploadDoc.single('document'), uploadDocument);
router.get('/my-documents', protectTeacher, getTeacherDocuments);
router.delete('/:id', protectTeacher, deleteDocument);

// Student routes
router.get('/teachers', protectStudent, getAllTeachers);
router.get('/teacher/:id', protectStudent, getTeacherProfile);
router.get('/download/:id', protectStudent, downloadDocument);

module.exports = router;
