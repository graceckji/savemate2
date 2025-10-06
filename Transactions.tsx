import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Transaction } from "@/entities/Transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "date-fns";

import TransactionList from "../components/transactions/TransactionList";
import AddTransactionDialog from "../components/transactions/AddTransactionDialog";
import TransactionFilters from "../components/transactions/TransactionFilters";

export default function TransactionsPage() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const allTransactions = await Transaction.filter(
        { user_email: currentUser.email },
        "-transaction_date"
      );
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.category !== "all") {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.transaction_date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.transaction_date) <= new Date(filters.endDate));
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    await Transaction.delete(transactionId);
    await loadData();
  };

  const handleSaveTransaction = async () => {
    await loadData();
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  // Calculate statistics
  const calculateWeeklyTotal = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return transactions
      .filter(t => {
        const date = new Date(t.transaction_date);
        return date >= weekStart && date <= weekEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateMonthlyTotal = () => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return transactions
      .filter(t => {
        const date = new Date(t.transaction_date);
        return date >= monthStart && date <= monthEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateDailyAverage = () => {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const daysWithTransactions = new Set(
      transactions.map(t => format(new Date(t.transaction_date), 'yyyy-MM-dd'))
    ).size;
    return total / (daysWithTransactions || 1);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Track your spending habits</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-lg bg-gradient-to-br from-red-500 to-pink-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${calculateWeeklyTotal().toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${calculateMonthlyTotal().toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${calculateDailyAverage().toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TransactionFilters filters={filters} onFiltersChange={setFilters} />

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Floating Add Button */}
      <Button
        onClick={handleAddTransaction}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-2xl hover:shadow-purple-300 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add/Edit Dialog */}
      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        transaction={editingTransaction}
        userEmail={user.email}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
