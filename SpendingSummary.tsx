import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShoppingBag } from "lucide-react";

const categoryIcons = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Subscriptions: "📱",
  Other: "📝"
};

export default function SpendingSummary({ budget, spent, transactions }) {
  const getCategoryBreakdown = () => {
    const breakdown = {};
    transactions.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });
    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const categoryData = getCategoryBreakdown();

  return (
    <Card className="border-none shadow-xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Spending Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryData.length > 0 ? (
          categoryData.map(([category, amount]) => {
            const percentage = (amount / spent) * 100;
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcons[category]}</span>
                    <span className="font-medium text-gray-900">{category}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${amount.toFixed(2)}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-gray-600 text-right">
                  {percentage.toFixed(0)}% of total spending
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
