import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js'; 
import { promisify } from 'util';

export default async (request, response, next) => {
  const authHeader = request.headers.authorization;
  let token = null;

  // 1. Verificação de cabeçalho ausente
  if (!authHeader) {
    return response.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
  }

  // 2. Extração e limpeza do token
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.substring(7).trim(); 
  } else {
    return response.status(401).json({ error: 'Formato de token inválido. Esperado: "Bearer <token>".' });
  }
  
  if (!token) {
      return response.status(401).json({ error: 'O token JWT está vazio.' });
  }

  // 3. Verificação do JWT
  try {
    // CORREÇÃO CRÍTICA: Usa await e promisify SEM o callback, que estava causando o erro.
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    
    // Anexa ID e admin à requisição
    request.userId = decoded.id; 
    request.admin = decoded.admin;
    request.userName = decoded.name;
    request.userIsAdmin = decoded.admin; // Mantendo o userIsAdmin por segurança

    // CRÍTICO: Se o token for válido, passa para o próximo middleware/controller.
    return next();

  } catch (err) {
    // Se o token for inválido (expirado ou secret errado)
    return response.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};