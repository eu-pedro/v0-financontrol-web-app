"use client";

import { useState, useMemo } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useFinanceStore } from "@/lib/store";
import type { Budget } from "@/lib/data";

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export default function BudgetPage() {
  const { budgets, categories, addBudget, updateBudget, deleteBudget } = useFinanceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
    limit: "",
    spent: "0",
    month: new Date().toISOString().slice(0, 7)
  });

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const stats = useMemo(() => {
    const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const overBudget = budgets.filter(b => b.spent > b.limit).length;
    const nearLimit = budgets.filter(b => {
      const percentage = (b.spent / b.limit) * 100;
      return percentage >= 80 && percentage < 100;
    }).length;
    
    return { totalLimit, totalSpent, overBudget, nearLimit };
  }, [budgets]);

  const alertBudgets = useMemo(() => {
    return budgets.filter(b => {
      const percentage = (b.spent / b.limit) * 100;
      return percentage >= 80;
    });
  }, [budgets]);

  const openAddDialog = () => {
    setEditingBudget(null);
    setFormData({
      categoryId: "",
      categoryName: "",
      limit: "",
      spent: "0",
      month: new Date().toISOString().slice(0, 7)
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      categoryName: budget.categoryName,
      limit: budget.limit.toString(),
      spent: budget.spent.toString(),
      month: budget.month
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = expenseCategories.find(c => c.id === formData.categoryId);
    
    const budgetData = {
      categoryId: formData.categoryId,
      categoryName: category?.name || formData.categoryName,
      limit: parseFloat(formData.limit),
      spent: parseFloat(formData.spent),
      month: formData.month
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este orcamento?")) {
      deleteBudget(id);
    }
  };

  const getStatusColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "destructive";
    if (percentage >= 80) return "warning";
    return "success";
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 80) return "bg-warning";
    return "bg-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orcamento</h1>
          <p className="text-muted-foreground">
            Defina limites mensais por categoria
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Orcamento
        </Button>
      </div>

      {/* Alerts */}
      {alertBudgets.length > 0 && (
        <div className="space-y-3">
          {alertBudgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOver = percentage >= 100;
            
            return (
              <Alert 
                key={budget.id} 
                className={isOver 
                  ? "border-destructive/50 bg-destructive/10" 
                  : "border-warning/50 bg-warning/10"
                }
              >
                <AlertTriangle className={`h-4 w-4 ${isOver ? 'text-destructive' : 'text-warning'}`} />
                <AlertTitle className={isOver ? 'text-destructive' : 'text-warning'}>
                  {isOver ? 'Orcamento Excedido!' : 'Orcamento Proximo do Limite!'}
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {budget.categoryName}: {formatCurrency(budget.spent)} de {formatCurrency(budget.limit)} ({percentage.toFixed(0)}%)
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orcamento Total</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(stats.totalLimit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proximo do Limite</p>
                <p className="text-xl font-bold text-foreground">{stats.nearLimit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponivel</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(Math.max(0, stats.totalLimit - stats.totalSpent))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Orcamentos por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const remaining = budget.limit - budget.spent;
            const status = getStatusColor(budget.spent, budget.limit);
            
            return (
              <div 
                key={budget.id} 
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-foreground">{budget.categoryName}</h4>
                    <Badge 
                      variant="outline"
                      className={`
                        ${status === 'destructive' ? 'border-destructive/30 text-destructive' : ''}
                        ${status === 'warning' ? 'border-warning/30 text-warning' : ''}
                        ${status === 'success' ? 'border-primary/30 text-primary' : ''}
                      `}
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(budget)}
                      className="h-8 w-8 text-muted-foreground hover:text-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(budget.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-3 bg-secondary"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor(budget.spent, budget.limit)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(budget.spent)} de {formatCurrency(budget.limit)}
                    </span>
                    <span className={`font-medium ${
                      remaining >= 0 ? 'text-primary' : 'text-destructive'
                    }`}>
                      {remaining >= 0 
                        ? `Restam ${formatCurrency(remaining)}` 
                        : `Excedido em ${formatCurrency(Math.abs(remaining))}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {budgets.length === 0 && (
            <div className="py-8 text-center">
              <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum orcamento definido</h3>
              <p className="text-muted-foreground mb-4">Crie seu primeiro orcamento mensal</p>
              <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Novo Orcamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingBudget ? "Editar Orcamento" : "Novo Orcamento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => {
                  const cat = expenseCategories.find(c => c.id === value);
                  setFormData({ 
                    ...formData, 
                    categoryId: value,
                    categoryName: cat?.name || ""
                  });
                }}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Limite Mensal</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  placeholder="0,00"
                  className="bg-input border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Gasto Atual</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.spent}
                  onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                  placeholder="0,00"
                  className="bg-input border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mes de Referencia</Label>
              <Input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="bg-input border-border"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                {editingBudget ? "Salvar" : "Criar Orcamento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
