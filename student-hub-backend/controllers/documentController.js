const Document = require('../models/Document');
const Teacher = require('../models/Teacher');
const fs = require('fs');
const path = require('path');

// Upload Document
exports.uploadDocument = async (req, res) => {
  try {
    const { title, subject } = req.body;
    const documentFile = req.file;

    if (!documentFile) {
      return res.status(400).json({
        success: false,
        message: 'Document file is required'
      });
    }

    const document = await Document.create({
      title,
      subject,
      documentPath: documentFile.path,
      originalName: documentFile.originalname,
      fileSize: documentFile.size,
      mimeType: documentFile.mimetype,
      teacher: req.teacher.id
    });

    // Update teacher's last document update
    await Teacher.findByIdAndUpdate(req.teacher.id, {
      lastDocumentUpdate: new Date(),
      $push: { documents: document._id }
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        title: document.title,
        subject: document.subject,
        originalName: document.originalName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

// Get Teacher's Documents
exports.getTeacherDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ teacher: req.teacher.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

// Delete Document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if document belongs to the teacher
    if (document.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.documentPath)) {
      fs.unlinkSync(document.documentPath);
    }

    // Remove document from teacher's documents array
    await Teacher.findByIdAndUpdate(req.teacher.id, {
      $pull: { documents: document._id }
    });

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// Get All Teachers with Document Count (for students)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({})
      .populate('documents')
      .select('name teacherId faculty image lastDocumentUpdate')
      .sort({ lastDocumentUpdate: -1 });

    const teachersWithCount = teachers.map(teacher => ({
      id: teacher._id,
      name: teacher.name,
      teacherId: teacher.teacherId,
      faculty: teacher.faculty,
      image: teacher.image,
      documentCount: teacher.documents.length,
      lastDocumentUpdate: teacher.lastDocumentUpdate
    }));

    res.status(200).json({
      success: true,
      count: teachersWithCount.length,
      teachers: teachersWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Get Teacher Profile with Documents (for students)
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: 'documents',
        select: 'title subject originalName fileSize mimeType createdAt'
      })
      .select('name teacherId faculty image lastDocumentUpdate');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        teacherId: teacher.teacherId,
        faculty: teacher.faculty,
        image: teacher.image,
        documentCount: teacher.documents.length,
        lastDocumentUpdate: teacher.lastDocumentUpdate,
        documents: teacher.documents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher profile',
      error: error.message
    });
  }
};

// Download Document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!fs.existsSync(document.documentPath)) {
      return res.status(404).json({
        success: false,
        message: 'Document file not found'
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.mimeType);
    
    const fileStream = fs.createReadStream(document.documentPath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading document',
      error: error.message
    });
  }
};
