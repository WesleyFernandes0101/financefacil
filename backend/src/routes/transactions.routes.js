const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../../middleware/authMiddleware');

const prisma = new PrismaClient();

router.use(authMiddleware);

//  GET - Todas as transações do usuário (com nome da categoria)
router.get('/', async (req, res) => {
  const userId = req.userId;
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  POST - Criar nova transação
router.post('/', async (req, res) => {
  const userId = req.userId;
  const { description, amount, type, categoryId, date } = req.body;

  if (!description || !amount || !type || !categoryId || !date) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verifica se a categoria pertence ao usuário
    const categoriaExiste = await prisma.category.findFirst({
      where: { id: categoryId, userId }
    });

    if (!categoriaExiste) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        userId,
        categoryId
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  DELETE - Deletar transação
router.delete('/:id', async (req, res) => {
  const userId = req.userId;
  const id = parseInt(req.params.id);

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transação deletada com sucesso.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  GET - Resumo (saldo, receitas, despesas e por categoria)
router.get('/summary', async (req, res) => {
  const userId = req.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true }
    });

    const totalReceitas = transactions
      .filter(t => t.type === 'receita')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalDespesas = transactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, t) => acc + t.amount, 0);

    const saldo = totalReceitas - totalDespesas;

    const categoriasMap = {};

    transactions.forEach(t => {
      const catName = t.category?.name || 'Sem Categoria';
      if (!categoriasMap[catName]) {
        categoriasMap[catName] = 0;
      }
      categoriasMap[catName] += t.amount;
    });

    const categorias = Object.entries(categoriasMap).map(([name, total]) => ({
      name,
      total
    }));

    res.json({
      saldo,
      totalReceitas,
      totalDespesas,
      categorias
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
