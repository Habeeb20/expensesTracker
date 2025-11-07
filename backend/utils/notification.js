// src/services/notificationService.js
import nodemailer from 'nodemailer';
import { Todo } from '../models/todoModel.js';
import User from '../models/userModel.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailAlert = async (to, subject, text) => {
  await transporter.sendMail({
    from: '"Expense Tracker" <no-reply@expensetracker.com>',
    to,
    subject,
    text,
  });
};

export const checkDueTodos = async () => {
  const now = new Date();
  const dueTodos = await Todo.find({
    dueDate: { $lte: now },
    completed: false,
    notify: true,
  }).populate('user', 'email first_name emailAlerts');

  for (const todo of dueTodos) {
    if (todo.user?.emailAlerts) {
      await sendEmailAlert(
        todo.user.email,
        `Reminder: ${todo.title}`,
        `Hi ${todo.user.first_name},\n\nYour task "${todo.title}" is due now!\n\nComplete it in the app.`
      );
    }
  }
};