/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { likeBlogPost, unlikeBlogPost } from "../api";
import { useSelector } from "react-redux";

function LikeBtn({ _id, isLiked, likes, setPost }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const likePost = async () => {
    if (!isLoggedIn) {
      toast.error("Login to like blog posts.");
      return;
    }

    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    const likeToast = toast.loading("Liking Post...");

    try {
      const response = await likeBlogPost(_id);

      toast.success(response.message || "Liked Post successfully.", { id: likeToast });

      // Update the state immediately for instant UI feedback
      setPost((prev) => ({ ...prev, liked: true, likes: (prev.likes || 0) + 1 }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to like post";
      toast.error(errorMessage, {
        id: likeToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const unlikePost = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    const unlikeToast = toast.loading("Unliking Post...");

    try {
      const response = await unlikeBlogPost(_id);

      toast.success(response.message || "Unliked Post successfully.", { id: unlikeToast });

      // Update the state immediately for instant UI feedback
      setPost((prev) => ({ ...prev, liked: false, likes: Math.max((prev.likes || 0) - 1, 0) }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to unlike post";
      toast.error(errorMessage, {
        id: unlikeToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 p-5">
      {isLiked ? (
        <FaHeart
          className={`h-7 w-7 cursor-pointer fill-red-600 transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          onClick={unlikePost}
        />
      ) : (
        <FaRegHeart 
          className={`h-7 w-7 cursor-pointer text-gray-600 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-600 hover:scale-110'}`}
          onClick={likePost} 
        />
      )}{" "}
      <p className="text-lg font-bold text-gray-900">{likes}</p>
    </div>
  );
}

export default LikeBtn;
