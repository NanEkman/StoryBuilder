import { Request, Response } from 'express';
import { addUserHistory, getUserHistory } from '../services/userHistoryService';

export async function createUserHistory(req: Request, res: Response) {
  try {
    const { user_id, action, details } = req.body;
    if (!user_id || !action) {
      return res.status(400).json({ error: 'user_id and action are required' });
    }
    const data = await addUserHistory({ user_id, action, details });
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUserHistoryByUser(req: Request, res: Response) {
  try {
    let { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    if (Array.isArray(user_id)) {
      user_id = user_id[0];
    }
    const data = await getUserHistory(user_id);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
