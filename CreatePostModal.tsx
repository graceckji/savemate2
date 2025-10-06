import React, { useState, useRef } from "react";
import { Post } from "@/entities/Post";
import { UploadFile } from "@/integrations/Core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePostModal({ open, onOpenChange, userEmail, onPostCreated }) {
  const [formData, setFormData] = useState({
    caption: "",
    price: "",
    privacy: "friends",
    image_url: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileInput = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url || !formData.price) return;

    setIsSaving(true);
    try {
      await Post.create({
        user_email: userEmail,
        caption: formData.caption,
        image_url: formData.image_url,
        price: parseFloat(formData.price),
        privacy: formData.privacy
      });

      setFormData({
        caption: "",
        price: "",
        privacy: "friends",
        image_url: ""
      });
      
      await onPostCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Spending</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <AnimatePresence mode="wait">
              {!formData.image_url ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    dragActive ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  {isUploading ? (
                    <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-purple-500" />
                  ) : (
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  )}
                  
                  <p className="font-medium text-gray-900 mb-1">
                    {isUploading ? "Uploading..." : "Click or drag to upload"}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-xl overflow-hidden"
                >
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-7 text-lg"
                required
              />
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption or emoji... ☕️"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="h-20 resize-none"
            />
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <Label>Privacy</Label>
            <RadioGroup
              value={formData.privacy}
              onValueChange={(value) => setFormData({ ...formData, privacy: value })}
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends" className="cursor-pointer flex-1">
                  <div className="font-medium">Friends Only</div>
                  <div className="text-sm text-gray-600">Only your friends can see this</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="cursor-pointer flex-1">
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-gray-600">Everyone can see this</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!formData.image_url || !formData.price || isSaving}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Share Post"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
