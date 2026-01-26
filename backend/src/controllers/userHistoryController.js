import { addUserHistory, getUserHistory } from "../services/userHistoryService.js";

export async function createUserHistory(req, res) {
  try {
    const { user_id, action, details } = req.body;

    if (!user_id || !action) {
      return res.status(400).json({ error: "user_id and action are required" });
    }

    const data = await addUserHistory({ user_id, action, details });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Server error" });
  }
}

export async function getUserHistoryByUser(req, res) {
  try {
    let { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const data = await getUserHistory(user_id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Server error" });
  }
}
