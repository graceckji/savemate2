import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

const categories = ["All", "Food", "Travel", "Shopping", "Subscriptions", "Other"];

export default function TransactionFilters({ selectedCategory, onCategoryChange, onReset }) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedCategory !== "All" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
