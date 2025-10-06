import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingDown, Calendar, DollarSign } from "lucide-react";
import { startOfWeek, startOfMonth, isAfter } from "date-fns";

export default function SpendingStats({ transactions }) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const weeklyTotal = transactions
    .filter(t => isAfter(new Date(t.created_date), weekStart))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const monthlyTotal = transactions
    .filter(t => isAfter(new Date(t.created_date), monthStart))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const dailyAverage = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + (t.amount || 0), 0) / 
      (Math.max(1, Math.ceil((now - new Date(transactions[transactions.length - 1]?.created_date)) / (1000 * 60 * 60 * 24))))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-700">This Week</span>
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-blue-900">
          ${weeklyTotal.toFixed(2)}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-700">This Month</span>
          <DollarSign className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-3xl font-bold text-purple-900">
          ${monthlyTotal.toFixed(2)}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-700">Daily Average</span>
          <TrendingDown className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-3xl font-bold text-green-900">
          ${dailyAverage.toFixed(2)}
        </div>
      </Card>
    </div>
  );
}
