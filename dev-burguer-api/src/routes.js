import { Router } from 'express'; 
import multer from 'multer'; 

// --- Importação de Configurações ---
import multerConfig from './config/multer.cjs';

// --- Importação de Middlewares ---
import adminMiddleware from './middewares/admin.js';
import authMiddleware from './middewares/auth.js'; 

// --- Importação de Controllers ---
import UserController from './App/controllers/UserController.js';
import SessionController from './App/controllers/SessionController.js';
import ProductController from './App/controllers/ProductController.js'; 
import CategoryController from './App/controllers/CategoryController.js'; 
import OrderController from './App/controllers/OrderController.js';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js';





const routes = new Router();
const upload = multer(multerConfig);

// ===================================
// 🛠️ ROTAS PÚBLICAS (Sem Autenticação)
// ===================================
// Estas rotas NÃO exigem token. O navegador consegue acessar as imagens aqui.

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Listagem de categorias e produtos para o Front-end (Público)
routes.get('/categories', CategoryController.index);
routes.get('/products', ProductController.index);

// ==============================================================
// 🔐 ROTAS AUTENTICADAS (Protegidas)
// ==============================================================


// --- CATEGORIAS ---
routes.post('/categories', authMiddleware, adminMiddleware, upload.single('file'), CategoryController.store);
routes.put('/categories/:id', authMiddleware, adminMiddleware, upload.single('file'), CategoryController.update);

// --- PRODUTOS ---
routes.post('/products', authMiddleware, adminMiddleware, upload.single('file'), ProductController.store);
routes.put('/products/:id', authMiddleware, adminMiddleware, upload.single('file'), ProductController.update);

// --- PEDIDOS ---
// Criar pedido (Qualquer usuário logado)
routes.post('/orders', authMiddleware, OrderController.store);
// Listar pedidos (Geralmente admin ou usuário logado)
routes.get('/orders', authMiddleware, adminMiddleware, OrderController.index);
// Alterar status do pedido (Apenas Admin)
routes.put('/orders/:id', authMiddleware, adminMiddleware, OrderController.update);


routes.post('/create_payment_intent', CreatePaymentIntentController.store);

export default routes; 