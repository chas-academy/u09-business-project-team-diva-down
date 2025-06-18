import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json({
      user: req.user,
      message: 'Profile data'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};