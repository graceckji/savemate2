import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Post } from "@/entities/Post";
import { Friend } from "@/entities/Friend";
import { Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import CreatePostModal from "../components/feed/CreatePostModal";
import PostCard from "../components/feed/PostCard";

export default function FeedPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Get friends
      const friendships = await Friend.filter({ status: "accepted" });
      const friendEmails = friendships
        .filter(f => f.requester_email === currentUser.email || f.recipient_email === currentUser.email)
        .map(f => f.requester_email === currentUser.email ? f.recipient_email : f.requester_email);

      // Get posts from friends and self
      const allPosts = await Post.list("-created_date");
      const feedPosts = allPosts.filter(p => 
        p.user_email === currentUser.email || 
        (friendEmails.includes(p.user_email) && p.privacy === "friends") ||
        p.privacy === "public"
      );

      setPosts(feedPosts);
    } catch (error) {
      console.error("Error loading feed:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
            <p className="text-gray-600">See what your friends are spending on</p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Post</span>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to share what you're spending on!
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="break-inside-avoid">
              <PostCard post={post} currentUser={user} onUpdate={loadData} />
            </div>
          ))}
        </div>
      )}

      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        userEmail={user?.email}
        onPostCreated={loadData}
      />

      {/* Floating Create Button (Mobile) */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 md:hidden right-4 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-2xl hover:shadow-pink-300 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
