"use client";

import { useState } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2,
  Briefcase,
  Laptop,
  TrendingUp,
  Utensils,
  Car,
  Home,
  Heart,
  Gamepad2,
  GraduationCap,
  ShoppingBag,
  Wallet,
  Gift,
  Plane,
  Music,
  Film
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useFinanceStore } from "@/lib/store";
import type { Category } from "@/lib/data";

const iconOptions = [
  { name: "Briefcase", icon: Briefcase },
  { name: "Laptop", icon: Laptop },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Utensils", icon: Utensils },
  { name: "Car", icon: Car },
  { name: "Home", icon: Home },
  { name: "Heart", icon: Heart },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Wallet", icon: Wallet },
  { name: "Gift", icon: Gift },
  { name: "Plane", icon: Plane },
  { name: "Music", icon: Music },
  { name: "Film", icon: Film },
];

const colorOptions = [
  "#22c55e", "#10b981", "#14b8a6", "#ef4444", "#f97316",
  "#eab308", "#ec4899", "#8b5cf6", "#3b82f6", "#06b6d4"
];

function getIconComponent(iconName: string) {
  const option = iconOptions.find(opt => opt.name === iconName);
  return option ? option.icon : Wallet;
}

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinanceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    color: "#22c55e",
    icon: "Wallet",
    type: "expense" as "income" | "expense"
  });

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      color: "#22c55e",
      icon: "Wallet",
      type: "expense"
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteCategory(id);
    }
  };

  const CategoryCard = ({ category }: { category: Category }) => {
    const IconComponent = getIconComponent(category.icon);
    
    return (
      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <IconComponent className="h-5 w-5" style={{ color: category.color }} />
          </div>
          <div>
            <p className="font-medium text-foreground">{category.name}</p>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                category.type === 'income' 
                  ? 'border-primary/30 text-primary' 
                  : 'border-destructive/30 text-destructive'
              }`}
            >
              {category.type === 'income' ? 'Receita' : 'Despesa'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(category)}
            className="h-8 w-8 text-muted-foreground hover:text-accent"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(category.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de receitas e despesas
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Income Categories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Categorias de Receita
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {incomeCategories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma categoria de receita cadastrada
            </p>
          ) : (
            incomeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-destructive/10 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-destructive" />
            </div>
            Categorias de Despesa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expenseCategories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma categoria de despesa cadastrada
            </p>
          ) : (
            expenseCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Alimentacao, Transporte..."
                className="bg-input border-border"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "income" | "expense") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Icone</Label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: option.name })}
                      className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                        formData.icon === option.name 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
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
                {editingCategory ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
