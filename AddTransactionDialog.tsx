import React, { useState, useEffect } from "react";
import { Transaction } from "@/entities/Transaction";
import { UploadFile } from "@/integrations/Core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, Loader2, Save } from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = ["Food", "Travel", "Shopping", "Subscriptions", "Other"];

export default function AddTransactionDialog({ open, onOpenChange, transaction, userEmail, onSave }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Other",
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    image_url: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        transaction_date: transaction.transaction_date,
        image_url: transaction.image_url || ""
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "Other",
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
        image_url: ""
      });
    }
  }, [transaction, open]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        user_email: userEmail
      };

      if (transaction) {
        await Transaction.update(transaction.id, data);
      } else {
        await Transaction.create(data);
      }

      await onSave();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Coffee at Starbucks"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Receipt Photo (Optional)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isUploadingImage}
                onClick={() => document.getElementById('receipt-upload')?.click()}
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {formData.image_url ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {formData.image_url && (
              <a
                href={formData.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700 block"
              >
                View uploaded receipt
              </a>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
