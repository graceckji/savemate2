import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRightLeft, TrendingDown } from "lucide-react";

const tradeoffExamples = [
  { amount: 5, equivalent: "a fancy coffee", alternative: "5 homemade coffees" },
  { amount: 15, equivalent: "a movie ticket", alternative: "a month of Netflix" },
  { amount: 25, equivalent: "takeout dinner", alternative: "groceries for 3 days" },
  { amount: 50, equivalent: "an Uber ride", alternative: "a week of bus passes" },
  { amount: 100, equivalent: "new shoes", alternative: "a month of gym membership" },
];

export default function TradeoffNotifications({ budget, spent, recentTransactions }) {
  const remaining = Math.max(0, budget.amount - spent);

  const getTradeoff = (amount) => {
    const closest = tradeoffExamples.reduce((prev, curr) =>
      Math.abs(curr.amount - amount) < Math.abs(prev.amount - amount) ? curr : prev
    );
    return closest;
  };

  const generateMessage = (transaction) => {
    const tradeoff = getTradeoff(transaction.amount);
    const remainingAfter = remaining - transaction.amount;
    
    if (remainingAfter < 0) {
      return `That $${transaction.amount.toFixed(2)} on ${transaction.description} pushed you $${Math.abs(remainingAfter).toFixed(2)} over budget!`;
    }
    
    return `That $${transaction.amount.toFixed(2)} on ${transaction.description} is like spending on ${tradeoff.equivalent} — you could've had ${tradeoff.alternative} instead.`;
  };

  if (recentTransactions.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.slice(0, 3).map((transaction, index) => (
          <motion.div
            key={transaction.id}
            
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            
            className="p-4 rounded-xl bg-white shadow-sm border border-purple-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{generateMessage(transaction)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {remaining > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white">
            <p className="font-semibold">💡 Pro Tip</p>
            <p className="text-sm mt-1">
              You have ${remaining.toFixed(2)} left. That's enough for{" "}
              {getTradeoff(remaining).alternative}!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
