// src/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import axios from "axios"
import crypto from "crypto"
import { verifyToken } from '../utils/helpers.js';
import Transaction from "../models/userModel.js"
import Budget from "../models/categoryModel.js"
const router = express.Router();


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // 1. Validate input
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // 2. Check if user exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Generate uniqueNumber
  const uniqueNumber = `RL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // 5. Prepare response
  const authResponse = {
    message: 'User registered successfully',
    user: null,
    token: null,
    externalServices: {
      authSystem: { success: false, message: 'Not attempted' },
      email: { success: false, message: 'Not attempted' },
    },
  };

  let user;

  try {
    // 6. Create local user
    user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      uniqueNumber,
    });

    // 7. Attempt external auth system
    try {
      await axios.post('https://auth.edirect.ng/api/register', {
        platform: 'expense-tracker',
        first_name,
        last_name,
        email,
        password, 
        role: 'user',
      });
      authResponse.externalServices.authSystem = {
        success: true,
        message: 'Auth system registration successful',
      };
    } catch (authError) {
      console.error('External auth failed:', authError.response?.data || authError.message);
      authResponse.externalServices.authSystem = {
        success: false,
        message: 'Failed to register with auth system',
      };
    
    }

    // 8. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 9. Clean user object
    const cleanUser = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      uniqueNumber: user.uniqueNumber,
      currency: user.currency,
      theme: user.theme,
    };

    // 10. Final response
    authResponse.user = cleanUser;
    authResponse.token = token;

    return res.status(201).json(authResponse);

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});






router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, first_name: user.first_name, email, role: user.role } });
});



router.post("/auto-login", async(req, res) => {
    const { email } = req.body;

    try {
        const response = await axios.post("https://auth.edirect.ng/api/auto-login", {
        email: email,
        platform: "edrive",
      });


       const user = response.data.user;
       console.log(user)
    if (!user?.id) {
      return res.status(400).json({
        status: false,
        message: "Invalid login response",
      });
    }


     let profile = null;
    try {
      profile = await Profile.findOne({ userId: user.userId });
    } catch (dbError) {
      console.warn("Profile lookup failed (non-critical):", dbError.message);
      res.status(400).json({message: "profile is not updated, please update your profile"})
    }
    

  
      const payload = {
      userId:user.userId,  
     
    
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

   let roleMessage = "";
 
   return res.status(200).json({
      status: true,
      message: `Successfully logged in. ${roleMessage}`,
      token,
      user: {
        _id: user._id,
   
        email: user.email,
        first_name: user.first_name,
      },
    });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
    }
})


router.get("/dashboard", verifyToken, async(req, res) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId).select('first_name currency theme');

    // 2. Get transactions
    const transactions = await Transaction.find({ user: userId });
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    // 3. Recent 5 transactions
    const recent = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .select('title amount type date');

    // 4. Active budgets
    const budgets = await Budget.find({ user: userId, isActive: true })
      .select('category limit spent');

    res.json({
      success: true,
      user: {
        name: user.first_name,
        currency: user.currency,
        theme: user.theme
      },
      summary: { balance, income, expense },
      recent,
      budgets
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



export default router;