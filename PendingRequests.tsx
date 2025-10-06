import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock } from "lucide-react";

export default function PendingRequests({ requests, onAccept, onReject }) {
  if (requests.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6 space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                <AvatarImage src={request.user?.profile_pic} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                  {request.user?.display_name?.[0] || request.user?.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {request.user?.display_name || request.user?.full_name}
                </p>
                {request.user?.username && (
                  <p className="text-sm text-purple-600">@{request.user.username}</p>
                )}
                <p className="text-sm text-gray-600">wants to be friends</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onAccept(request.id)}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 gap-2"
              >
                <Check className="w-4 h-4" />
                Accept
              </Button>
              <Button
                onClick={() => onReject(request.id)}
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
              >
                <X className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
