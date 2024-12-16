import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user_id = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token' });
  }
};
