import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Award, Flame, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function MyRankCard({ rank, user, data }) {
  if (!user || !data) return null;

  const getRankMessage = () => {
    if (rank === 1) return "You're the champion! 🏆";
    if (rank === 2) return "So close to #1! Keep pushing! 🥈";
    if (rank === 3) return "Great job! You're in the top 3! 🥉";
    return `You're currently ranked #${rank}`;
  };

  return (
    <motion.div
      
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      
    >
      <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white/30">
                <AvatarImage src={user.profile_pic} />
                <AvatarFallback className="bg-white/20 text-white text-2xl">
                  {user.display_name?.[0] || user.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              {rank <= 3 && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-yellow-900" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Your Rank: #{rank}</h2>
              <p className="text-white/90 mb-4">{getRankMessage()}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white/80 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Saved</span>
                  </div>
                  <p className="text-xl font-bold">${data.totalSaved.toFixed(0)}</p>
                </div>

                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white/80 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs">Success</span>
                  </div>
                  <p className="text-xl font-bold">{data.successRate.toFixed(0)}%</p>
                </div>

                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white/80 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs">Streak</span>
                  </div>
                  <p className="text-xl font-bold">{data.streak}w</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
