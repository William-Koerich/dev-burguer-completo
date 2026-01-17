import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
  // Criar nova categoria
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { filename: path } = request.file;
    const { name } = request.body;

    const categoryExists = await Category.findOne({
      where: { name },
    });

    if (categoryExists) {
      return response.status(409).json({ error: 'Essa categoria já existe.' });
    }

    const { id } = await Category.create({
      name,
      path,
    });

    return response.status(201).json({ id, name });
  }

  // O seu método index
  async index(_request, response) {
    const categories = await Category.findAll(); 
    return response.status(200).json({ categories });
  }

  // Atualizar categoria
  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { id } = request.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return response.status(400).json({ error: 'Categoria não encontrada.' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name } = request.body;

    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ where: { name } });

      if (categoryExists) {
        return response.status(409).json({ error: 'Já existe uma categoria com este nome.' });
      }
    }

    await category.update({
      name,
      path,
    });

    return response.json({ id, name, path });
  }
}

export default new CategoryController();