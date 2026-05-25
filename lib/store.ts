"use client";

import { create } from 'zustand';
import { transactions as initialTransactions, categories as initialCategories, goals as initialGoals, budgets as initialBudgets } from './data';
import type { Transaction, Category, Goal, Budget } from './data';

interface FinanceStore {
  // Auth state
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Budgets
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  login: (email: string) => {
    set({ isAuthenticated: true, user: { name: email.split('@')[0], email } });
    return true;
  },
  register: (name: string, email: string) => {
    set({ isAuthenticated: true, user: { name, email } });
    return true;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
  
  // Transactions
  transactions: initialTransactions,
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }]
  })),
  updateTransaction: (id, transaction) => set((state) => ({
    transactions: state.transactions.map((t) => t.id === id ? { ...t, ...transaction } : t)
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id)
  })),
  
  // Categories
  categories: initialCategories,
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { ...category, id: Date.now().toString() }]
  })),
  updateCategory: (id, category) => set((state) => ({
    categories: state.categories.map((c) => c.id === id ? { ...c, ...category } : c)
  })),
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id)
  })),
  
  // Goals
  goals: initialGoals,
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, { ...goal, id: Date.now().toString() }]
  })),
  updateGoal: (id, goal) => set((state) => ({
    goals: state.goals.map((g) => g.id === id ? { ...g, ...goal } : g)
  })),
  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter((g) => g.id !== id)
  })),
  
  // Budgets
  budgets: initialBudgets,
  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, { ...budget, id: Date.now().toString() }]
  })),
  updateBudget: (id, budget) => set((state) => ({
    budgets: state.budgets.map((b) => b.id === id ? { ...b, ...budget } : b)
  })),
  deleteBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((b) => b.id !== id)
  })),
}));
