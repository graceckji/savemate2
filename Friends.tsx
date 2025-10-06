import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Friend } from "@/entities/Friend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Clock, Search as SearchIcon } from "lucide-react";

import SearchUsers from "../components/friends/SearchUsers";
import FriendsList from "../components/friends/FriendsList";
import PendingRequests from "../components/friends/PendingRequests";
import SuggestedFriends from "../components/friends/SuggestedFriends";

export default function FriendsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      await loadFriends(user.email);
      await loadPendingRequests(user.email);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadFriends = async (userEmail) => {
    const friendships = await Friend.filter({ status: "accepted" });
    const friendEmails = friendships
      .filter(f => f.requester_email === userEmail || f.recipient_email === userEmail)
      .map(f => f.requester_email === userEmail ? f.recipient_email : f.requester_email);

    if (friendEmails.length > 0) {
      const allUsers = await User.list();
      const friendUsers = allUsers.filter(u => friendEmails.includes(u.email));
      setFriends(friendUsers);
    } else {
      setFriends([]);
    }
  };

  const loadPendingRequests = async (userEmail) => {
    const allRequests = await Friend.filter({ status: "pending" });
    
    const received = allRequests.filter(r => r.recipient_email === userEmail);
    const sent = allRequests.filter(r => r.requester_email === userEmail);

    if (received.length > 0) {
      const allUsers = await User.list();
      const receivedWithUsers = received.map(req => ({
        ...req,
        user: allUsers.find(u => u.email === req.requester_email)
      }));
      setPendingRequests(receivedWithUsers);
    } else {
      setPendingRequests([]);
    }

    setSentRequests(sent);
  };

  const handleAcceptRequest = async (requestId) => {
    await Friend.update(requestId, { status: "accepted" });
    await loadData();
  };

  const handleRejectRequest = async (requestId) => {
    await Friend.delete(requestId);
    await loadData();
  };

  const handleRemoveFriend = async (friendEmail) => {
    const friendships = await Friend.filter({ status: "accepted" });
    const friendship = friendships.find(
      f =>
        (f.requester_email === currentUser.email && f.recipient_email === friendEmail) ||
        (f.recipient_email === currentUser.email && f.requester_email === friendEmail)
    );
    if (friendship) {
      await Friend.delete(friendship.id);
      await loadData();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
          <p className="text-gray-600">Connect with your SaveMate community</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm p-1 rounded-xl shadow-sm">
          <TabsTrigger value="friends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            <Users className="w-4 h-4 mr-2" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="search" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg relative">
            <Clock className="w-4 h-4 mr-2" />
            Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            <UserPlus className="w-4 h-4 mr-2" />
            Suggested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendsList
            friends={friends}
            currentUser={currentUser}
            onRemoveFriend={handleRemoveFriend}
          />
        </TabsContent>

        <TabsContent value="search">
          <SearchUsers
            currentUser={currentUser}
            friends={friends}
            sentRequests={sentRequests}
            onRequestSent={loadData}
          />
        </TabsContent>

        <TabsContent value="requests">
          <PendingRequests
            requests={pendingRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        </TabsContent>

        <TabsContent value="suggestions">
          <SuggestedFriends
            currentUser={currentUser}
            friends={friends}
            sentRequests={sentRequests}
            onRequestSent={loadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
