import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Budget } from "@/entities/Budget";
import { Transaction } from "@/entities/Transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth, isWithinInterval } from "date-fns";

import BudgetForm from "../components/budget/BudgetForm";
import BudgetProgressGauge from "../components/budget/BudgetProgressGauge";
import TradeoffNotifications from "../components/budget/TradeoffNotifications";
import SpendingSummary from "../components/budget/SpendingSummary";

export default function BudgetPage() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Get current budget
      const budgets = await Budget.filter({ user_email: currentUser.email }, "-created_date");
      const activeBudget = budgets.find(b => {
        const now = new Date();
        return isWithinInterval(now, {
          start: new Date(b.start_date),
          end: new Date(b.end_date)
        });
      });
      setBudget(activeBudget || null);

      // Get transactions for current period
      const allTransactions = await Transaction.filter({ user_email: currentUser.email });
      
      if (activeBudget) {
        const periodTransactions = allTransactions.filter(t => {
          const transDate = new Date(t.transaction_date);
          return isWithinInterval(transDate, {
            start: new Date(activeBudget.start_date),
            end: new Date(activeBudget.end_date)
          });
        });
        setTransactions(periodTransactions);
      } else {
        setTransactions(allTransactions);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const calculateSpent = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const calculatePercentage = () => {
    if (!budget) return 0;
    return (calculateSpent() / budget.amount) * 100;
  };

  const getAlertLevel = () => {
    const percentage = calculatePercentage();
    if (percentage >= 100) return "exceeded";
    if (percentage >= 80) return "warning";
    return "safe";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const spent = calculateSpent();
  const percentage = calculatePercentage();
  const alertLevel = getAlertLevel();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
          <p className="text-gray-600">Stay on track with your spending goals</p>
        </div>
      </div>

      {/* Budget Form */}
      {!budget && (
        <BudgetForm userEmail={user?.email} onBudgetCreated={loadData} />
      )}

      {budget && (
        <>
          {/* Alert Banners */}
          {alertLevel === "exceeded" && (
            <Card className="border-none shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Budget Exceeded!</h3>
                    <p className="text-white/90">
                      You've spent ${spent.toFixed(2)} of your ${budget.amount.toFixed(2)} budget. 
                      That's ${(spent - budget.amount).toFixed(2)} over your limit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {alertLevel === "warning" && (
            <Card className="border-none shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Approaching Your Limit</h3>
                    <p className="text-white/90">
                      You've used {percentage.toFixed(0)}% of your budget. Only ${(budget.amount - spent).toFixed(2)} remaining!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {alertLevel === "safe" && percentage > 0 && (
            <Card className="border-none shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">You're Doing Great!</h3>
                    <p className="text-white/90">
                      You've spent ${spent.toFixed(2)} of ${budget.amount.toFixed(2)}. Keep up the good work!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Gauge */}
          <div className="grid md:grid-cols-2 gap-6">
            <BudgetProgressGauge
              spent={spent}
              budget={budget.amount}
              percentage={percentage}
              period={budget.period}
            />

            <SpendingSummary
              budget={budget}
              spent={spent}
              transactions={transactions}
            />
          </div>

          {/* Tradeoff Notifications */}
          <TradeoffNotifications
            budget={budget}
            spent={spent}
            recentTransactions={transactions.slice(0, 5)}
          />

          {/* Edit Budget */}
          <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Update Your Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetForm
                userEmail={user?.email}
                existingBudget={budget}
                onBudgetCreated={loadData}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
