import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';

import {User} from '../db.js';

dotenv.config();


// Register
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    try {

      let user = await User.findOne({ where: { name } });
      if (user) return res.status(400).json({ message: 'User already Exists' });
  
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = await User.create({ name, email, password: hashedPassword, });
  
      const payload = { user: { id: user.id } };
  
      jwt.sign(
        payload,
        process.env.secretkey,
        { expiresIn: '8h' },
        (err, token) => {
          if (err) throw err;

          res.send({token: token, id: user.id, name: user.name, email: user.email});

        }
      );
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
}


// Login
export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

      let user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: 'User Not Found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
  
      const payload = { user: { id: user.id } };
  
      jwt.sign(
        payload,
        process.env.secretkey,
        { expiresIn: '8h' },
        (err, token) => {
          if (err) throw err;

          res.send({token: token, id: user.id, name: user.name, email: user.email});

        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
}