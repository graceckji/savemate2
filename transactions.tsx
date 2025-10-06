import React, { useState, useEffect } from "react";
import { Transaction } from "@/entities/Transaction";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SpendingStats from "../components/transactions/SpendingStats";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
import AddTransactionModal from "../components/transactions/AddTransactionModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      const data = await Transaction.filter({ user_id: user.id }, "-created_date");
      setTransactions(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const filterTransactions = () => {
    if (selectedCategory === "All") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(t => t.category === selectedCategory)
      );
    }
  };

  const handleSaveTransaction = async (transactionData) => {
    if (editingTransaction) {
      await Transaction.update(editingTransaction.id, transactionData);
    } else {
      await Transaction.create({
        ...transactionData,
        user_id: currentUser.id
      });
    }
    await loadData();
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await Transaction.delete(id);
      await loadData();
    }
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">Track your spending and stay on budget</p>
        </div>

        <SpendingStats transactions={transactions} />

        <TransactionFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onReset={() => setSelectedCategory("All")}
        />

        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      <Button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
}
