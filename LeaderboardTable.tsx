import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Flame } from "lucide-react";
import { motion } from "framer-motion";

const getRankColor = (rank) => {
  if (rank === 1) return "from-yellow-400 to-yellow-600";
  if (rank === 2) return "from-gray-300 to-gray-500";
  if (rank === 3) return "from-orange-400 to-orange-600";
  return "from-purple-400 to-blue-400";
};

const getRankIcon = (rank) => {
  if (rank <= 3) {
    return <Trophy className="w-5 h-5 text-white" />;
  }
  return <span className="text-white font-bold">{rank}</span>;
};

const getSuccessColor = (rate) => {
  if (rate >= 90) return "bg-green-100 text-green-800 border-green-200";
  if (rate >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
};

export default function LeaderboardTable({ data, currentUserEmail }) {
  return (
    <Card className="border-none shadow-xl bg-white overflow-hidden">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {data.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.user.email === currentUserEmail;

            return (
              <motion.div
                key={entry.user.id}
                
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                
                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                  isCurrentUser ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-14 h-14 ring-2 ring-purple-100">
                    <AvatarImage src={entry.user.profile_pic} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-lg">
                      {entry.user.display_name?.[0] || entry.user.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {entry.user.display_name || entry.user.full_name}
                      </h3>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          You
                        </Badge>
                      )}
                      {rank === 1 && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                          👑 Champion
                        </Badge>
                      )}
                    </div>

                    {entry.user.username && (
                      <p className="text-sm text-purple-600 mb-2">@{entry.user.username}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        ${entry.totalSaved.toFixed(2)} saved
                      </div>
                      
                      <Badge variant="secondary" className={`${getSuccessColor(entry.successRate)} border`}>
                        {entry.successRate.toFixed(0)}% success
                      </Badge>

                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-600 font-medium">
                          <Flame className="w-4 h-4" />
                          {entry.streak} week streak
                        </div>
                      )}

                      {entry.user.accountability_mode && (
                        <Badge variant="outline" className="border-purple-300 text-purple-700">
                          🔔 Accountability On
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No data available yet. Start saving to appear on the leaderboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
