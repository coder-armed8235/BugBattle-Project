import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera } from 'lucide-react';
import axiosClient from '../utils/axiosClient'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from 'axios'

const EditProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").min(3, "At least 3 characters"),
  username: z.string().min(1, "Username is required").min(3, "At least 3 characters"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  location: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  twitter: z.string().optional(),
  github: z.string().optional(),
});

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
 const [imageFile, setImageFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(EditProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      username: "",
      bio: "",
      location: "",
      website: "",
      twitter: "",
      github: "",
    }
  });
  useEffect(() => {
  if (!profile || !isOpen) return;
  reset({
  fullName: profile?.fullName || "",
  username: profile?.username || "",
  bio: profile?.bio || "",
  location: profile?.location || "",
  website: profile?.website || "",
  twitter: profile?.twitter || "",
  github: profile?.github || "",
});

 if (!imageFile) {
    setAvatarPreview(profile?.avatarUrl || "");
  }
  }, [profile, isOpen, reset,imageFile]);

useEffect(() => {
  return () => {
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
  };
}, [avatarPreview]);

const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setImageFile(file);
  };

const uploadImageToCloudinary = async (file) => {
  try {
    const { data } = await axiosClient.get('/video/cloudinary/signature');

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", data.apiKey);
    formData.append("timestamp", data.timestamp);
    formData.append("signature", data.signature);
    formData.append("folder", data.folder);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
      formData
    );

    return response.data.secure_url;

  } catch (error) {
    alert("ERROR RESPONSE:", error.response?.data);
    throw error;
  }
};

 const onSubmit = async (data) => {
    try {
      let avatarUrl = profile?.avatarUrl || "";

       if (imageFile) {
      avatarUrl = await uploadImageToCloudinary(imageFile);
    }

     const payload = {
      fullName: data.fullName,
      username: data.username,
      bio: data.bio || "",
      location: data.location || "",
      website: data.website || "",
      twitter: data.twitter || "",
      github: data.github || "",
      avatarUrl,
    };
      const res = await axiosClient.patch(
        "/Auth/update/profile",
        payload
      );

      alert("Profile updated successfully");
      onSave?.(res.data.data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-[#161b22] shadow-2xl border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 p-5 px-6 pb-4">
                <h2 className="text-xl font-bold text-neutral-100">Edit Profile</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700">
                <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-700 bg-neutral-800 transition-colors group-hover:border-emerald-500/50">
                        <img
                           src={
                              avatarPreview ||
                              profile?.avatarUrl ||
                              'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'
                            }
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera className="text-white" size={24} />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      Change Picture
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-neutral-400">Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        {...register("fullName")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-neutral-400">Username</label>
                      <input
                        type="text"
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="johndoe"
                        {...register("username")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-400">Bio</label>
                    <textarea
                      rows={3}
                      className="resize-none rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      placeholder="Tell us about yourself..."
                      {...register("bio")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-400">Location</label>
                    <input
                      type="text"
                      className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      placeholder="San Francisco, CA"
                      {...register("location")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-400">Website</label>
                    <input
                      type="url"
                      className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      placeholder="https://example.com"
                      {...register("website")}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-neutral-400">Twitter (X)</label>
                      <input
                        type="text"
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="username"
                        {...register("twitter")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-neutral-400">GitHub</label>
                      <input
                        type="text"
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="username"
                        {...register("github")}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="border-t border-neutral-800 bg-[#161b22] px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-profile-form"
                  className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}