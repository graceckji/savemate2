import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Friend } from "@/entities/Friend";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Sparkles, Loader2 } from "lucide-react";

export default function SuggestedFriends({ currentUser, friends, sentRequests, onRequestSent }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(null);

  useEffect(() => {
    loadSuggestions();
  }, [friends]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const friendEmails = friends.map(f => f.email);
      const sentEmails = sentRequests.map(r => r.recipient_email);

      // Get all friendships to find mutual connections
      const allFriendships = await Friend.filter({ status: "accepted" });
      
      // Find friends of friends
      const friendsOfFriends = new Set();
      friendEmails.forEach(friendEmail => {
        const theirFriends = allFriendships
          .filter(f => f.requester_email === friendEmail || f.recipient_email === friendEmail)
          .map(f => f.requester_email === friendEmail ? f.recipient_email : f.requester_email);
        
        theirFriends.forEach(email => {
          if (email !== currentUser.email && !friendEmails.includes(email) && !sentEmails.includes(email)) {
            friendsOfFriends.add(email);
          }
        });
      });

      if (friendsOfFriends.size > 0) {
        const allUsers = await User.list();
        const suggestedUsers = allUsers.filter(u => friendsOfFriends.has(u.email));
        setSuggestions(suggestedUsers.slice(0, 10));
      } else {
        // If no mutual friends, suggest random users
        const allUsers = await User.list();
        const randomUsers = allUsers.filter(
          u => u.email !== currentUser.email && !friendEmails.includes(u.email) && !sentEmails.includes(u.email)
        );
        setSuggestions(randomUsers.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
    setIsLoading(false);
  };

  const handleSendRequest = async (recipientEmail) => {
    setSendingRequest(recipientEmail);
    try {
      await Friend.create({
        requester_email: currentUser.email,
        recipient_email: recipientEmail,
        status: "pending"
      });
      await onRequestSent();
      setSuggestions(prev => prev.filter(u => u.email !== recipientEmail));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    setSendingRequest(null);
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-500" />
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No suggestions yet</h3>
          <p className="text-gray-600">Add more friends to get personalized suggestions!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center gap-2 mb-4 text-purple-600">
          <Sparkles className="w-5 h-5" />
          <p className="font-medium">People you may know</p>
        </div>

        {suggestions.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                <AvatarImage src={user.profile_pic} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                  {user.display_name?.[0] || user.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {user.display_name || user.full_name}
                </p>
                {user.username && (
                  <p className="text-sm text-purple-600">@{user.username}</p>
                )}
                {user.bio && (
                  <p className="text-sm text-gray-600 line-clamp-1">{user.bio}</p>
                )}
              </div>
            </div>

            <Button
              onClick={() => handleSendRequest(user.email)}
              disabled={sendingRequest === user.email}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 gap-2"
            >
              {sendingRequest === user.email ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add
                </>
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
