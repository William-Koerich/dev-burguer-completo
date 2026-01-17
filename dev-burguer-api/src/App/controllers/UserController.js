import * as Yup from 'yup';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid'; // <-- NÃO ESQUEÇA DE INSTALAR: pnpm install uuid
import bcrypt from 'bcryptjs';

class UserController {
  async store(request, response) {
    // 1. Definição do Schema de Validação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean().optional(), 
    });

    // Validação dos dados de entrada
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Falha na validação dos dados.' });
    }

  
    // Checagem de usuário existente
    const userExists = await User.findOne({ 
      where: { email: request.body.email } 
    });

    if (userExists) {
      return response.status(400).json({ error: 'Usuário já existe.' });
    }

    // Desestruturação dos dados do body
    const { name, email, password, admin } = request.body;
    
    // 🛑 AÇÃO CRÍTICA 1: Geramos o ID manualmente.
    // Isso resolve o erro "notNull Violation: User.id cannot be null"
    const userId = uuidv4(); 
    
    // Garantimos que 'admin' seja false se não for fornecido
    const isAdmin = admin !== undefined ? admin : false;


    // 🛑 AÇÃO CRÍTICA 2: Chamamos User.create PASSANDO o ID gerado.
    const { id, admin: createdAdmin } = await User.create({
        id: userId, // <-- AQUI ESTÁ A CHAVE para o problema do ID nulo!
        name, 
        email, 
        password,
        admin: isAdmin, 
    });
    
    // Retorna a resposta de sucesso
    return response.status(201).json({ id, name, email, admin: createdAdmin });
  }
}

export default new UserController();
