/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import { marked } from "marked";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { Comment, LikeBtn, FollowBtn } from "./index";
import { deletePost, getUserProfile } from "../api/index";

function BlogPost({
  blogSummaryResponse,
  likes,
  comments,
  liked,
  setPost,
}) {
  const [deletingPost, setDeletingPost] = useState(false);
  const [authorPosts, setAuthorPosts] = useState(null); // null means loading
  const [postsLoading, setPostsLoading] = useState(true);
  const [authorData, setAuthorData] = useState(null); // For live author data

  const navigate = useNavigate();

  // Extract data from blogSummaryResponse
  const {
    blogId,
    title,
    slug,
    featureImage,
    content,
    visits,
    createdAt,
    updatedAt,
    blogAuthorResponseDTO
  } = blogSummaryResponse || {};

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const handleDeletePost = async () => {
    const deleteBlogToast = toast.loading("Deleting Blog Post...");
    setDeletingPost(true);

    try {
      const response = await deletePost(blogId);

      toast.success(response.message || "Blog Post deleted successfully.", {
        id: deleteBlogToast,
      });
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to delete post";
      toast.error(errorMessage, {
        id: deleteBlogToast,
      });
    } finally {
      setDeletingPost(false);
    }
  };

  useEffect(() => {
    if (blogSummaryResponse.blogAuthorResponseDTO && blogSummaryResponse.blogAuthorResponseDTO.userName) {
      // Set initial author data from blog response
      setAuthorData(blogSummaryResponse.blogAuthorResponseDTO);
      
      // Check if posts data is already available in the author response
      if (blogSummaryResponse.blogAuthorResponseDTO.posts !== undefined) {
        setAuthorPosts({ posts: blogSummaryResponse.blogAuthorResponseDTO.posts });
        setPostsLoading(false);
        return;
      }
      
      // Otherwise fetch the user profile to get complete and live data
      getUserProfile(blogSummaryResponse.blogAuthorResponseDTO.userName).then((response) => {
        // Update both posts count and complete author data
        setAuthorPosts({ posts: response.data.posts || 0 });
        setAuthorData(response.data); // This gives us live follower count
        setPostsLoading(false);
      }).catch(error => {
        console.error('Failed to load author profile:', error);
        setAuthorPosts({ posts: 0 });
        setPostsLoading(false);
      });
    } else {
      setPostsLoading(false);
    }
  }, [blogSummaryResponse.blogAuthorResponseDTO]);

  // Check if current user is the author of this blog post
  const { data: user, userId: storedUserId, isLoggedIn } = useSelector((state) => state.auth);
  
  // Fallback: try to extract userId from current session if not stored
  const currentUserId = storedUserId || user?.userId || user?._id;
  const authorUserId = blogAuthorResponseDTO?.userId;
  
  // Multiple comparison approaches
  const exactMatch = currentUserId && authorUserId && String(currentUserId) === String(authorUserId);
  const userNameMatch = user?.userName && blogAuthorResponseDTO?.userName && user.userName === blogAuthorResponseDTO.userName;
  
  // Show edit/delete if user is logged in and either ID matches or username matches
  const isAuthor = isLoggedIn && (exactMatch || userNameMatch);

  return (
    <div className="my-6">
      <div className="flex flex-col gap-8">
        {isAuthor && (
          <div className="card flex items-center gap-4">
            <button
              onClick={() => navigate(`/blog/edit/${blogId}`)}
              className="btn-primary"
            >
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              disabled={deletingPost}
            >
              {deletingPost ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-e-blue-700"></div>
              ) : (
                "Delete"
              )}
            </button>
            <p className="transition-colors duration-300 text-gray-600">*This button only display to you.</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl blog-title">{title || 'Loading...'}</h1>
          <div className="flex items-center justify-start gap-2 transition-colors duration-300 text-gray-600">
            <FaRegEye className="h-5 w-5" />
            <p>
              <span className="font-semibold">{visits || 0}</span> views
            </p>
          </div>
          <p className="text-lg font-medium transition-colors duration-300 text-gray-600">
            {createdAt ? formatDate(createdAt) : 'Loading...'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center border-b border-t border-gray-300 bg-gray-100/50 rounded-xl">
              <LikeBtn
                _id={blogId}
                isLiked={liked}
                likes={likes}
                setPost={setPost}
              />
              <a href="#comments" className="flex items-center gap-2 p-5 text-gray-600 hover:text-gray-900 transition-colors">
                <MdOutlineComment className="h-6 w-6" />
                <p className="text-lg font-semibold">{comments}</p>
              </a>
            </div>
            {featureImage && (
              <img
                className="mx-auto mb-6 aspect-video rounded-2xl object-cover shadow-lg"
                src={featureImage}
                alt={title || 'Blog post image'}
              />
            )}
            <div className="prose prose-gray prose-lg max-w-none text-gray-800">
              {content ? parse(marked.parse(content)) : <p className="text-gray-600">Loading content...</p>}
            </div>
              <div className="mt-12">
              <Comment
                _id={blogId}
                title={title}
                featureImage={featureImage}
                content={content}
                blogAuthorResponseDTO={blogSummaryResponse.blogAuthorResponseDTO}
                visits={visits}
                setPost={setPost}
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="card flex flex-col gap-5">
              <p className="text-gray-600 font-medium">Author</p>
              {blogSummaryResponse.blogAuthorResponseDTO ? (
                <Link
                  to={`/u/${blogSummaryResponse.blogAuthorResponseDTO.userName}`}
                  className="flex items-center gap-4 group"
                >
                  <img
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-300 group-hover:ring-blue-500 transition-all duration-200"
                    src={blogSummaryResponse.blogAuthorResponseDTO.avtar}
                    alt=""
                  />
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-400 transition-colors">
                      {blogSummaryResponse.blogAuthorResponseDTO.name}
                    </p>
                    <p className="text-gray-600">@{blogSummaryResponse.blogAuthorResponseDTO.userName}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-300 animate-pulse"></div>
                  <div>
                    <p className="font-semibold text-gray-600">Loading...</p>
                    <p className="text-gray-600">@loading</p>
                  </div>
                </div>
              )}
              
              {/* Follow button for non-authors */}
              {!isAuthor && isLoggedIn && authorData && (
                <FollowBtn 
                  userData={authorData} 
                  onFollowChange={(newFollowerCount, newIsFollowing) => {
                    // Update the live author data with new follower count and following status
                    setAuthorData(prev => prev ? { 
                      ...prev, 
                      followers: newFollowerCount,
                      isFollowing: newIsFollowing 
                    } : prev);
                  }}
                />
              )}
              
              <div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {postsLoading ? "..." : (authorPosts?.posts || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {authorData?.followers !== undefined ? authorData.followers : (blogSummaryResponse.blogAuthorResponseDTO?.followers || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {authorData?.following !== undefined ? authorData.following : (blogSummaryResponse.blogAuthorResponseDTO?.following || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
