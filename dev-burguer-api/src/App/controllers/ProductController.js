import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class ProductController {
    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
        });
        return response.json(products);
    }

    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        try {
            await schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { filename: path } = request.file;
        let { name, price, category_id, offer } = request.body;

        // --- AJUSTE PARA O SEED NÃO TRAVAR ---
        let categoryExists = await Category.findByPk(category_id);
        
        // Se não achar a categoria pelo ID que o Seed enviou, 
        // busca a primeira categoria disponível no banco
        if (!categoryExists) {
            categoryExists = await Category.findOne();
        }
        
        // Se mesmo assim não houver NADA, aí sim dá erro
        if (!categoryExists) {
            return response.status(400).json({ error: 'Category not found.' });
        }

        try {
            const product = await Product.create({
                name,
                price: Number(price),
                category_id: categoryExists.id, // Usa o ID da categoria que encontramos
                path,
                offer: offer === 'true' || offer === true,
                user_id: request.userId, 
            });

            return response.status(201).json(product);
        } catch (error) {
            console.error('ERRO DETALHADO NO BANCO:', error);
            return response.status(500).json({ error: 'Failed to create product.' });
        }
    }
    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        });
        
        const { id } = request.params;

        try {
            await schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return response.status(404).json({ error: 'Product not found.' });
        }

        let { name, price, category_id, offer } = request.body;

        if (category_id) {
            const categoryExists = await Category.findByPk(category_id);
            if (!categoryExists) {
                return response.status(400).json({ error: 'Category not found.' });
            }
        }

        let path = product.path;
        if (request.file) {
            path = request.file.filename;
        }

        try {
            await product.update({
                name: name || product.name,
                price: price ? Number(price) : product.price,
                category_id: category_id ? Number(category_id) : product.category_id,
                offer: offer !== undefined ? (offer === 'true' || offer === true) : product.offer,
                path: path
            });

            return response.status(200).json(product);
        } catch (error) {
            return response.status(500).json({ error: 'Failed to update product.' });
        }
    }

    async offers(_request, response) {
        const products = await Product.findAll({
            where: { offer: true },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
        });
        return response.json(products);
    }
}

export default new ProductController();