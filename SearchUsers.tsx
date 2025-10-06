import React, { useState } from "react";
import { User } from "@/entities/User";
import { Friend } from "@/entities/Friend";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, Check, Clock, Loader2 } from "lucide-react";

export default function SearchUsers({ currentUser, friends, sentRequests, onRequestSent }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const allUsers = await User.list();
      const friendEmails = friends.map(f => f.email);
      const sentEmails = sentRequests.map(r => r.recipient_email);

      const results = allUsers.filter(
        u =>
          u.email !== currentUser.email &&
          !friendEmails.includes(u.email) &&
          !sentEmails.includes(u.email) &&
          (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setIsSearching(false);
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
      setSearchResults(prev => prev.filter(u => u.email !== recipientEmail));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    setSendingRequest(null);
  };

  const isFriend = (email) => friends.some(f => f.email === email);
  const isRequestSent = (email) => sentRequests.some(r => r.recipient_email === email);

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((user) => (
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

                {isFriend(user.email) ? (
                  <Button disabled variant="outline" className="gap-2">
                    <Check className="w-4 h-4" />
                    Friends
                  </Button>
                ) : isRequestSent(user.email) ? (
                  <Button disabled variant="outline" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Pending
                  </Button>
                ) : (
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
                        Add Friend
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No users found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Search for SaveMate users to connect with</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
