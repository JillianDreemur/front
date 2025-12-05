import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_super_seguro_aqui';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    const userResponse = {
      ...userWithoutPassword,
      id: String(userWithoutPassword.id),
    };

    res.json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (role !== 'VENDEDOR' && role !== 'CLIENTE') {
      return res.status(400).json({ error: 'Role deve ser VENDEDOR ou CLIENTE' });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, hashedPassword, role]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'Cadastro realizado com sucesso',
      user: newUser,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [
        decoded.userId,
      ]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const user = result.rows[0];
      user.id = String(user.id);

      res.json(user);
    } catch (jwtError) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (error) {
    console.error('Erro na validação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

