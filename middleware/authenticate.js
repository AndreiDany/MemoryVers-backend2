import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();


export default async function authenticate(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Auth Error' });

  try {

    const decoded = jwt.verify(token, process.env.secretkey);
    req.userId = decoded.user.id;

    next();

  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Invalid Token' });
  }
}