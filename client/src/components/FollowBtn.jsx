/* eslint-disable react/prop-types */
import { followUser, unfollowUser } from "../api/index";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";

function FollowBtn({ userData, setUserData, onFollowChange }) {
  const [loading, setLoading] = useState(false);

  const isUserLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const follow = async () => {
    const followToast = toast.loading("Following user...");

    if (!isUserLoggedIn) {
      toast.error("Login to follow users.", {
        id: followToast,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await followUser(userData.userName);

      const newFollowerCount = userData.followers + 1;
      const newIsFollowing = true;

      // Update parent component data if setUserData is provided
      if (setUserData) {
        setUserData((prev) => ({
          ...userData,
          isFollowing: newIsFollowing,
          followers: newFollowerCount,
        }));
      }

      // Call onFollowChange callback if provided
      if (onFollowChange) {
        onFollowChange(newFollowerCount, newIsFollowing);
      }

      toast.success(response.message || "followed", {
        id: followToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to follow user";
      toast.error(errorMessage, {
        id: followToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async () => {
    const unfollowToast = toast.loading("Unfollowing user...");

    setLoading(true);

    try {
      const response = await unfollowUser(userData.userName);

      const newFollowerCount = userData.followers - 1;
      const newIsFollowing = false;

      // Update parent component data if setUserData is provided
      if (setUserData) {
        setUserData((prev) => ({
          ...prev,
          isFollowing: newIsFollowing,
          followers: newFollowerCount,
        }));
      }

      // Call onFollowChange callback if provided
      if (onFollowChange) {
        onFollowChange(newFollowerCount, newIsFollowing);
      }

      toast.success(response.message || "unfollowed", {
        id: unfollowToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to unfollow user";
      toast.error(errorMessage, {
        id: unfollowToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {userData.isFollowing ? (
        <button
          className={
            "rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 md:text-base"
          }
          onClick={unfollow}
          disabled={loading}
        >
          {loading ? (
            <div className="inline-block size-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
          ) : (
            "Unfollow"
          )}
        </button>
      ) : (
        <button
          className="rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 md:text-base"
          onClick={follow}
          disabled={loading}
        >
          {loading ? (
            <div className="inline-block size-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
          ) : (
            "Follow"
          )}
        </button>
      )}
    </div>
  );
}

export default FollowBtn;
