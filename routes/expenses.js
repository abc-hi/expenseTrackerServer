import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new expense    http://localhost:5000/api/expenses
router.post('/', async (req, res) => {
  const { amount, category, date, description } = req.body;
  const newExpense = new Expense({ amount, category, date, description });
  try {
    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// http://localhost:5000/api/expenses/summary

router.get('/summary', async (req, res) => {
  try {
    const expenses = await Expense.find(); // Fetch all expenses from database

    if (!expenses) {
      return res.status(404).json({ message: 'No expenses found' });
    }

    // Example summary calculation
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    res.json({ total: totalExpenses });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// http://localhost:5000/api/expenses/chart-data
// Get chart data
router.get('/chart-data', async (req, res) => {
  try {
    const monthlyData = await Expense.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      }
    ]);
    const categoryData = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);
    res.json({ monthly: monthlyData, categories: categoryData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;



