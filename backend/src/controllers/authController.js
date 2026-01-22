// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { supabase } = require("../lib/supabaseClient");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Alla fält måste fyllas i" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Lösenordet måste vara minst 6 tecken" });
    }
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Användarnamn eller email redan använt" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword }])
      .select("id, username, email, created_at")
      .single();
    if (error) throw error;
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${username},email.eq.${username}`)
      .maybeSingle();
    if (error) throw error;
    if (!user) {
      return res
        .status(401)
        .json({ error: "Felaktigt användarnamn eller lösenord" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ error: "Felaktigt användarnamn eller lösenord" });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, created_at")
      .eq("id", req.userId)
      .maybeSingle();
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: "Användare inte funnen" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ error: error.message });
  }
};
