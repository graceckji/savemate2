import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Receipt, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const categoryColors = {
  Food: "bg-orange-100 text-orange-800 border-orange-200",
  Travel: "bg-blue-100 text-blue-800 border-blue-200",
  Shopping: "bg-pink-100 text-pink-800 border-pink-200",
  Subscriptions: "bg-purple-100 text-purple-800 border-purple-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200"
};

const categoryIcons = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Subscriptions: "📱",
  Other: "📝"
};

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">Start tracking your expenses by adding your first transaction!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {categoryIcons[transaction.category]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {transaction.description}
                    </h3>
                    <p className="text-lg font-bold text-red-600 flex-shrink-0">
                      -${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                    <Badge variant="secondary" className={`${categoryColors[transaction.category]} border`}>
                      {transaction.category}
                    </Badge>
                    <span>•</span>
                    <span>{format(new Date(transaction.transaction_date), 'MMM d, yyyy')}</span>
                    {transaction.image_url && (
                      <>
                        <span>•</span>
                        <a
                          href={transaction.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ImageIcon className="w-3 h-3" />
                          Receipt
                        </a>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(transaction)}
                      className="h-8 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(transaction.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
