// Mock data for the finance app

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  month: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Salario', color: '#22c55e', icon: 'Briefcase', type: 'income' },
  { id: '2', name: 'Freelance', color: '#10b981', icon: 'Laptop', type: 'income' },
  { id: '3', name: 'Investimentos', color: '#14b8a6', icon: 'TrendingUp', type: 'income' },
  { id: '4', name: 'Alimentacao', color: '#ef4444', icon: 'Utensils', type: 'expense' },
  { id: '5', name: 'Transporte', color: '#f97316', icon: 'Car', type: 'expense' },
  { id: '6', name: 'Moradia', color: '#eab308', icon: 'Home', type: 'expense' },
  { id: '7', name: 'Saude', color: '#ec4899', icon: 'Heart', type: 'expense' },
  { id: '8', name: 'Lazer', color: '#8b5cf6', icon: 'Gamepad2', type: 'expense' },
  { id: '9', name: 'Educacao', color: '#3b82f6', icon: 'GraduationCap', type: 'expense' },
  { id: '10', name: 'Compras', color: '#06b6d4', icon: 'ShoppingBag', type: 'expense' },
];

export const transactions: Transaction[] = [
  { id: '1', description: 'Salario Mensal', amount: 8500, type: 'income', category: 'Salario', date: '2024-01-05' },
  { id: '2', description: 'Projeto Freelance', amount: 2500, type: 'income', category: 'Freelance', date: '2024-01-10' },
  { id: '3', description: 'Supermercado', amount: 450, type: 'expense', category: 'Alimentacao', date: '2024-01-08' },
  { id: '4', description: 'Gasolina', amount: 280, type: 'expense', category: 'Transporte', date: '2024-01-12' },
  { id: '5', description: 'Aluguel', amount: 2200, type: 'expense', category: 'Moradia', date: '2024-01-01' },
  { id: '6', description: 'Plano de Saude', amount: 450, type: 'expense', category: 'Saude', date: '2024-01-05' },
  { id: '7', description: 'Netflix + Spotify', amount: 65, type: 'expense', category: 'Lazer', date: '2024-01-07' },
  { id: '8', description: 'Curso Online', amount: 197, type: 'expense', category: 'Educacao', date: '2024-01-15' },
  { id: '9', description: 'Dividendos', amount: 320, type: 'income', category: 'Investimentos', date: '2024-01-20' },
  { id: '10', description: 'Restaurante', amount: 185, type: 'expense', category: 'Alimentacao', date: '2024-01-18' },
  { id: '11', description: 'Uber', amount: 95, type: 'expense', category: 'Transporte', date: '2024-01-19' },
  { id: '12', description: 'Roupas', amount: 380, type: 'expense', category: 'Compras', date: '2024-01-22' },
  { id: '13', description: 'Cinema', amount: 75, type: 'expense', category: 'Lazer', date: '2024-01-25' },
  { id: '14', description: 'Farmacia', amount: 120, type: 'expense', category: 'Saude', date: '2024-01-23' },
  { id: '15', description: 'Bonus', amount: 1500, type: 'income', category: 'Salario', date: '2024-01-28' },
];

export const goals: Goal[] = [
  { id: '1', name: 'Fundo de Emergencia', targetAmount: 30000, currentAmount: 18500, deadline: '2024-06-01', color: '#3b82f6' },
  { id: '2', name: 'Viagem Europa', targetAmount: 15000, currentAmount: 8200, deadline: '2024-12-01', color: '#8b5cf6' },
  { id: '3', name: 'Carro Novo', targetAmount: 50000, currentAmount: 12000, deadline: '2025-06-01', color: '#22c55e' },
  { id: '4', name: 'Curso de Especializacao', targetAmount: 8000, currentAmount: 5500, deadline: '2024-08-01', color: '#f97316' },
];

export const budgets: Budget[] = [
  { id: '1', categoryId: '4', categoryName: 'Alimentacao', limit: 1200, spent: 635, month: '2024-01' },
  { id: '2', categoryId: '5', categoryName: 'Transporte', limit: 600, spent: 375, month: '2024-01' },
  { id: '3', categoryId: '6', categoryName: 'Moradia', limit: 2500, spent: 2200, month: '2024-01' },
  { id: '4', categoryId: '7', categoryName: 'Saude', limit: 800, spent: 570, month: '2024-01' },
  { id: '5', categoryId: '8', categoryName: 'Lazer', limit: 400, spent: 340, month: '2024-01' },
  { id: '6', categoryId: '9', categoryName: 'Educacao', limit: 500, spent: 197, month: '2024-01' },
  { id: '7', categoryId: '10', categoryName: 'Compras', limit: 600, spent: 580, month: '2024-01' },
];

export const monthlyData = [
  { month: 'Ago', income: 9200, expenses: 5800 },
  { month: 'Set', income: 8800, expenses: 6200 },
  { month: 'Out', income: 11500, expenses: 7100 },
  { month: 'Nov', income: 9500, expenses: 5900 },
  { month: 'Dez', income: 12800, expenses: 8500 },
  { month: 'Jan', income: 12820, expenses: 4497 },
];

export const expensesByCategory = [
  { name: 'Moradia', value: 2200, color: '#eab308' },
  { name: 'Alimentacao', value: 635, color: '#ef4444' },
  { name: 'Saude', value: 570, color: '#ec4899' },
  { name: 'Transporte', value: 375, color: '#f97316' },
  { name: 'Lazer', value: 140, color: '#8b5cf6' },
  { name: 'Educacao', value: 197, color: '#3b82f6' },
  { name: 'Compras', value: 380, color: '#06b6d4' },
];
