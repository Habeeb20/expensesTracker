// src/utils/helpers.js
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";
import { format, startOfMonth, endOfMonth, addDays, addMonths, addYears } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

// Month range
export const getMonthRange = (date = new Date()) => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
});

// Next recurring date
export const getNextRecurringDate = (lastDate, interval) => {
  switch (interval) {
    case 'daily': return addDays(lastDate, 1);
    case 'weekly': return addDays(lastDate, 7);
    case 'monthly': return addMonths(lastDate, 1);
    case 'yearly': return addYears(lastDate, 1);
    default: return lastDate;
  }
};

// Pagination
export const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return {
    data: array.slice(start, start + limit),
    total: array.length,
    page,
    pages: Math.ceil(array.length / limit),
  };
};

// Generate PDF (in-memory buffer)
export const generatePDFBuffer = (docData) => {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(20).text(docData.title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(docData.body);
  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};






export const verifyToken = async (req, res, next) => {
  try {
  
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.token; 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await User.findById(decoded.id).select('-password');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found.',
      });
    }

 
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};









// export const verifyToken = async (req, res, next) => {
//   try {
  
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.startsWith('Bearer ')
//       ? authHeader.split(' ')[1]
//       : req.cookies?.token; 

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access denied. No token provided.',
//       });
//     }


//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // const user = await User.findById(decoded.id).select('-password');
//     const user = await User.findOne({userId: decoded.userId }).select('_id userId');
//     if (!user) {
//          console.log('User not found for ID:', decoded.id);
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token - user not found.',
//       });
//     }

 
//     // req.user = user;
 
//     req.user = {
//          id: user._id.toString(),        // MongoDB _id
//          userId: user.userId,  
//     }
//       console.log('Verified user:', req.user);
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error.message);

//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token.',
//       });
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token expired. Please log in again.',
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error during authentication.',
//     });
//   }
// };
