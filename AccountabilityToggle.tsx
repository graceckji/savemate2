import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Users } from "lucide-react";

export default function AccountabilityToggle({ enabled, onToggle }) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Accountability Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label htmlFor="accountability-mode" className="text-base font-medium cursor-pointer">
              Alert friends when I overspend
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              When enabled, your friends will be notified if you exceed your budget limit.
              This helps keep you accountable to your financial goals!
            </p>
          </div>
          <Switch
            id="accountability-mode"
            checked={enabled}
            onCheckedChange={onToggle}
            className="ml-4"
          />
        </div>

        {enabled && (
          <div className="mt-4 p-4 rounded-xl bg-white border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <Users className="w-4 h-4" />
              <p className="font-semibold text-sm">Active Accountability</p>
            </div>
            <p className="text-xs text-gray-600">
              Your friends can now see your budget progress and will receive notifications
              when you go over your limit. Stay strong! 💪
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
