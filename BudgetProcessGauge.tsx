import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function BudgetProgressGauge({ spent, budget, percentage, period }) {
  const remaining = Math.max(0, budget - spent);
  const data = [
    { name: "Spent", value: spent },
    { name: "Remaining", value: remaining }
  ];

  const getColor = () => {
    if (percentage >= 100) return "#ef4444"; // red
    if (percentage >= 80) return "#f59e0b"; // orange
    return "#10b981"; // green
  };

  return (
    <Card className="border-none shadow-xl bg-white">
      <CardHeader>
        <CardTitle className="capitalize">{period} Budget Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill={getColor()} />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <motion.div
            
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="text-5xl font-bold" style={{ color: getColor() }}>
              {Math.min(100, percentage).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">of budget used</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Spent</p>
            <p className="text-2xl font-bold text-gray-900">${spent.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-green-50">
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className="text-2xl font-bold text-green-600">${remaining.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
