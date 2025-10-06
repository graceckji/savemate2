import React, { useState, useEffect } from "react";
import { Budget } from "@/entities/Budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, addDays } from "date-fns";

export default function BudgetForm({ userEmail, existingBudget, onBudgetCreated }) {
  const [formData, setFormData] = useState({
    amount: "",
    period: "monthly"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingBudget) {
      setFormData({
        amount: existingBudget.amount.toString(),
        period: existingBudget.period
      });
    }
  }, [existingBudget]);

  const calculateDates = (period) => {
    const now = new Date();
    if (period === "weekly") {
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 })
      };
    } else {
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { start, end } = calculateDates(formData.period);
      const budgetData = {
        user_email: userEmail,
        amount: parseFloat(formData.amount),
        period: formData.period,
        start_date: format(start, 'yyyy-MM-dd'),
        end_date: format(end, 'yyyy-MM-dd')
      };

      if (existingBudget) {
        await Budget.update(existingBudget.id, budgetData);
      } else {
        await Budget.create(budgetData);
      }

      await onBudgetCreated();
    } catch (error) {
      console.error("Error saving budget:", error);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Budget Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="500.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          className="text-lg"
        />
      </div>

      <div className="space-y-3">
        <Label>Budget Period</Label>
        <RadioGroup
          value={formData.period}
          onValueChange={(value) => setFormData({ ...formData, period: value })}
        >
          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="cursor-pointer flex-1">
              <div className="font-semibold">Weekly</div>
              <div className="text-sm text-gray-600">Resets every Monday</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="cursor-pointer flex-1">
              <div className="font-semibold">Monthly</div>
              <div className="text-sm text-gray-600">Resets on the 1st of each month</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {existingBudget ? 'Update Budget' : 'Set Budget'}
      </Button>
    </form>
  );
}
