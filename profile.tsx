import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit2, Save, Loader2, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    profile_pic: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        username: currentUser.username || "",
        display_name: currentUser.display_name || currentUser.full_name || "",
        bio: currentUser.bio || "",
        profile_pic: currentUser.profile_pic || ""
      });
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, profile_pic: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploadingImage(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      await loadUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Profile Header Card */}
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 ring-4 ring-purple-100">
                <AvatarImage src={formData.profile_pic} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-3xl">
                  {formData.display_name[0] || user.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  {isUploadingImage ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </label>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-4 w-full">
              {isEditing ? (
                <>
                  <Input
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="text-lg font-semibold"
                  />
                  <Input
                    placeholder="Display Name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="h-20"
                  />
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {user.display_name || user.full_name}
                    </h2>
                    {user.username && (
                      <p className="text-purple-600 font-medium">@{user.username}</p>
                    )}
                  </div>
                  {user.bio && (
                    <p className="text-gray-600 max-w-2xl">{user.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {format(new Date(user.created_date), 'MMM yyyy')}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-center sm:justify-start">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: user.username || "",
                          display_name: user.display_name || user.full_name || "",
                          bio: user.bio || "",
                          profile_pic: user.profile_pic || ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-purple-200 hover:bg-purple-50"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Savings Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-purple-100 text-sm">Total Saved</p>
              <p className="text-4xl font-bold">${user.total_saved?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-medium text-gray-900">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Role</span>
            <span className="font-medium text-gray-900 capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium text-gray-900">
              {format(new Date(user.created_date), 'MMMM d, yyyy')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
