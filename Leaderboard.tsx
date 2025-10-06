import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Friend } from "@/entities/Friend";
import { Budget } from "@/entities/Budget";
import { Transaction } from "@/entities/Transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Loader2, Crown, Award } from "lucide-react";
import { isWithinInterval } from "date-fns";

import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import AccountabilityToggle from "../components/leaderboard/AccountabilityToggle";
import MyRankCard from "../components/leaderboard/MyRankCard";

export default function LeaderboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Get friends
      const friendships = await Friend.filter({ status: "accepted" });
      const friendEmails = friendships
        .filter(f => f.requester_email === user.email || f.recipient_email === user.email)
        .map(f => f.requester_email === user.email ? f.recipient_email : f.requester_email);

      // Include current user
      const allEmails = [user.email, ...friendEmails];
      const allUsers = await User.list();
      const relevantUsers = allUsers.filter(u => allEmails.includes(u.email));

      // Calculate success rates
      const leaderboard = await Promise.all(
        relevantUsers.map(async (u) => {
          const budgets = await Budget.filter({ user_email: u.email }, "-created_date");
          const currentBudget = budgets.find(b => {
            const now = new Date();
            return isWithinInterval(now, {
              start: new Date(b.start_date),
              end: new Date(b.end_date)
            });
          });

          let successRate = 100;
          if (currentBudget) {
            const transactions = await Transaction.filter({ user_email: u.email });
            const periodTransactions = transactions.filter(t => {
              const transDate = new Date(t.transaction_date);
              return isWithinInterval(transDate, {
                start: new Date(currentBudget.start_date),
                end: new Date(currentBudget.end_date)
              });
            });

            const spent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
            const percentage = (spent / currentBudget.amount) * 100;
            successRate = Math.max(0, 100 - Math.max(0, percentage - 100));
          }

          return {
            user: u,
            totalSaved: u.total_saved || 0,
            successRate,
            streak: u.current_streak || 0
          };
        })
      );

      // Sort by total saved (primary) and success rate (secondary)
      leaderboard.sort((a, b) => {
        if (b.totalSaved !== a.totalSaved) {
          return b.totalSaved - a.totalSaved;
        }
        return b.successRate - a.successRate;
      });

      setLeaderboardData(leaderboard);

      // Find current user's rank
      const rank = leaderboard.findIndex(entry => entry.user.email === user.email) + 1;
      setMyRank(rank);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
    setIsLoading(false);
  };

  const handleAccountabilityToggle = async (enabled) => {
    await User.updateMyUserData({ accountability_mode: enabled });
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600">See how you rank among your friends</p>
        </div>
      </div>

      {/* My Rank Card */}
      <MyRankCard
        rank={myRank}
        user={currentUser}
        data={leaderboardData.find(entry => entry.user.email === currentUser?.email)}
      />

      {/* Accountability Toggle */}
      <AccountabilityToggle
        enabled={currentUser?.accountability_mode || false}
        onToggle={handleAccountabilityToggle}
      />

      {/* Leaderboard Table */}
      <LeaderboardTable
        data={leaderboardData}
        currentUserEmail={currentUser?.email}
      />

      {/* Legend */}
      <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">How Rankings Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Saved:</span> Primary ranking metric
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Success Rate:</span> How well you stay within budget
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Medal className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Streak:</span> Consecutive weeks staying on budget
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
