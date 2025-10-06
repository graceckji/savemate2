import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { PostLike } from "@/entities/PostLike";
import { Comment } from "@/entities/Comment";
import { Reaction } from "@/entities/Reaction";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

import CommentSection from "./CommentSection";
import EmojiReactionPicker from "./EmojiReactionPicker";

export default function PostCard({ post, currentUser, onUpdate }) {
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [reactions, setReactions] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPriceOverlay, setShowPriceOverlay] = useState(false);

  useEffect(() => {
    loadPostData();
  }, [post.id]);

  const loadPostData = async () => {
    // Load author
    const allUsers = await User.list();
    const postAuthor = allUsers.find(u => u.email === post.user_email);
    setAuthor(postAuthor);

    // Load likes
    const likes = await PostLike.filter({ post_id: post.id });
    setLikesCount(likes.length);
    setIsLiked(likes.some(l => l.user_email === currentUser.email));

    // Load comments count
    const comments = await Comment.filter({ post_id: post.id });
    setCommentsCount(comments.length);

    // Load reactions
    const postReactions = await Reaction.filter({ post_id: post.id });
    const reactionCounts = {};
    postReactions.forEach(r => {
      reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
    });
    setReactions(reactionCounts);
  };

  const handleLike = async () => {
    if (isLiked) {
      const likes = await PostLike.filter({ post_id: post.id, user_email: currentUser.email });
      if (likes[0]) {
        await PostLike.delete(likes[0].id);
      }
    } else {
      await PostLike.create({
        post_id: post.id,
        user_email: currentUser.email
      });
    }
    await loadPostData();
  };

  const handleReaction = async (emoji) => {
    const existingReactions = await Reaction.filter({
      post_id: post.id,
      user_email: currentUser.email
    });

    if (existingReactions.length > 0) {
      await Reaction.delete(existingReactions[0].id);
    }

    await Reaction.create({
      post_id: post.id,
      user_email: currentUser.email,
      emoji
    });

    setShowEmojiPicker(false);
    await loadPostData();
  };

  if (!author) return null;

  return (
    <motion.div
      
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      
      className="mb-4"
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
        {/* Author Info */}
        <div className="p-4 flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-purple-100">
            <AvatarImage src={author.profile_pic} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
              {author.display_name?.[0] || author.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">
              {author.display_name || author.full_name}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
            </p>
          </div>
          {post.privacy === "friends" && (
            <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
              Friends
            </Badge>
          )}
        </div>

        {/* Image with Price Overlay */}
        <div
          className="relative cursor-pointer group"
          onMouseEnter={() => setShowPriceOverlay(true)}
          onMouseLeave={() => setShowPriceOverlay(false)}
        >
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full object-cover"
          />
          
          <AnimatePresence>
            {showPriceOverlay && (
              <motion.div
                
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <motion.div
                  
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.5 }}
                  
                  className="bg-white rounded-2xl px-6 py-3 shadow-2xl"
                >
                  <p className="text-3xl font-bold text-gray-900">
                    ${post.price.toFixed(2)}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Caption & Interactions */}
        <div className="p-4 space-y-3">
          {post.caption && (
            <p className="text-gray-900">{post.caption}</p>
          )}

          {/* Reactions Display */}
          {Object.keys(reactions).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(reactions).map(([emoji, count]) => (
                <Badge
                  key={emoji}
                  variant="secondary"
                  className="bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji} {count}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{commentsCount}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>

              {showEmojiPicker && (
                <EmojiReactionPicker
                  onSelect={handleReaction}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                
              >
                <CommentSection
                  postId={post.id}
                  currentUser={currentUser}
                  onCommentAdded={loadPostData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
