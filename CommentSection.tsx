import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Comment } from "@/entities/Comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export default function CommentSection({ postId, currentUser, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const postComments = await Comment.filter({ post_id: postId }, "-created_date");
    
    // Load comment authors
    const allUsers = await User.list();
    const commentsWithAuthors = postComments.map(comment => ({
      ...comment,
      author: allUsers.find(u => u.email === comment.user_email)
    }));

    setComments(commentsWithAuthors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await Comment.create({
        post_id: postId,
        user_email: currentUser.email,
        text: commentText.trim()
      });

      setCommentText("");
      await loadComments();
      await onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={currentUser.profile_pic} />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-xs">
            {currentUser.display_name?.[0] || currentUser.full_name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!commentText.trim() || isSubmitting}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            
            className="flex items-start gap-2"
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={comment.author?.profile_pic} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-xs">
                {comment.author?.display_name?.[0] || comment.author?.full_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-2xl px-3 py-2">
                <p className="font-semibold text-sm text-gray-900">
                  {comment.author?.display_name || comment.author?.full_name}
                </p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-3">
                {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
