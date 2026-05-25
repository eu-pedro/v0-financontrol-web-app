"use client";

import { useState } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useFinanceStore } from "@/lib/store";
import type { Goal } from "@/lib/data";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

const colorOptions = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f97316", "#ec4899", 
  "#06b6d4", "#eab308", "#ef4444"
];

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinanceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    color: "#3b82f6"
  });

  const openAddDialog = () => {
    setEditingGoal(null);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      color: "#3b82f6"
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      color: goal.color
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline,
      color: formData.color
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      deleteGoal(id);
    }
  };

  const addToGoal = (goal: Goal, amount: number) => {
    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    updateGoal(goal.id, { currentAmount: newAmount });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas Financeiras</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso das suas metas
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Metas</p>
                <p className="text-2xl font-bold text-foreground">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Economizado</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(goals.reduce((acc, g) => acc + g.currentAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metas Concluidas</p>
                <p className="text-2xl font-bold text-foreground">
                  {goals.filter(g => g.currentAmount >= g.targetAmount).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          
          return (
            <Card key={goal.id} className="bg-card border-border overflow-hidden">
              <div className="h-1" style={{ backgroundColor: goal.color }} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <Target className="h-5 w-5" style={{ color: goal.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(goal.deadline), "dd MMM yyyy", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(goal)}
                      className="h-8 w-8 text-muted-foreground hover:text-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(goal.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium text-foreground">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2 bg-secondary"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold" style={{ color: goal.color }}>
                        {formatCurrency(goal.currentAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        de {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                    {!isCompleted && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo vencido'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Faltam {formatCurrency(remaining)}
                        </p>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Concluida!</span>
                      </div>
                    )}
                  </div>

                  {!isCompleted && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToGoal(goal, 100)}
                        className="flex-1"
                      >
                        +R$100
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToGoal(goal, 500)}
                        className="flex-1"
                      >
                        +R$500
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToGoal(goal, 1000)}
                        className="flex-1"
                      >
                        +R$1000
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma meta cadastrada</h3>
            <p className="text-muted-foreground mb-4">Crie sua primeira meta financeira</p>
            <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingGoal ? "Editar Meta" : "Nova Meta"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Meta</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Fundo de Emergencia, Viagem..."
                className="bg-input border-border"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Alvo</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="0,00"
                  className="bg-input border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Atual</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  placeholder="0,00"
                  className="bg-input border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data Limite</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-input border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-8 w-8 rounded-full transition-transform ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-offset-card ring-accent scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                {editingGoal ? "Salvar" : "Criar Meta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
