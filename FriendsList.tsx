import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMinus, Users, DollarSign } from "lucide-react";
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

export default function FriendsList({ friends, currentUser, onRemoveFriend }) {
  if (friends.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends yet</h3>
          <p className="text-gray-600">Start connecting with other SaveMate users!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend) => (
        <Card key={friend.id} className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="h-24 bg-gradient-to-br from-purple-400 to-blue-400" />
            <div className="px-6 pb-6 -mt-12">
              <Avatar className="w-20 h-20 ring-4 ring-white mb-4">
                <AvatarImage src={friend.profile_pic} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-2xl">
                  {friend.display_name?.[0] || friend.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {friend.display_name || friend.full_name}
                </h3>
                {friend.username && (
                  <p className="text-sm text-purple-600">@{friend.username}</p>
                )}
                {friend.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{friend.bio}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign className="w-4 h-4" />
                  ${friend.total_saved?.toFixed(2) || '0.00'} saved
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50">
                    <UserMinus className="w-4 h-4" />
                    Remove Friend
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {friend.display_name || friend.full_name} from your friends?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemoveFriend(friend.email)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
