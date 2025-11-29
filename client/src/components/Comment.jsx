import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CommentCard } from "./index";
import { createComment, getPostComments } from "../api";

// eslint-disable-next-line react/prop-types
function Comment({ _id, setPost }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const [postingComment, setPostingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const loggedInUser = useSelector((state) => state.auth.data);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const fetchComments = async () => {
    try {
      const response = await getPostComments(_id);
      // Ensure comments is always an array, even if response.data is null or undefined
      setComments(response.data || []);
    } catch (error) {
      console.log("comment fetch error: ", error);
      // Set to empty array on error
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      toast.error("Enter comment !!!");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Login first to post comment");
      return;
    }

    const createCommentToast = toast.loading("uploading comment...");
    setPostingComment(true);

    try {
      const response = await createComment({ blogId: _id, content });

      // Update the comment count immediately in the parent component
      if (setPost) {
        setPost((prev) => ({
          ...prev,
          comments: (prev.comments || 0) + 1
        }));
      }

      await fetchComments();

      toast.success(response.message || "Comment posted successfully", {
        id: createCommentToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "error while posting comment";
      toast.error(errorMessage, {
        id: createCommentToast,
      });
    } finally {
      setPostingComment(false);
      setContent("");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchComments();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card flex flex-col gap-6">
      <h1 id="comments" className="text-3xl font-bold text-gray-900">
        Comments
      </h1>
      
      {/* Comment form - only show for logged-in users */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">
              <img
                src={loggedInUser?.avtar || 'https://res.cloudinary.com/dpw1lvfiw/image/upload/v1756907093/Untitled_design_3_orpt7o.png'}
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-gray-600"
                alt="user profile"
              />
            </div>
            <input
              className="input flex-1"
              placeholder="Enter comment..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>
          <button
            disabled={postingComment}
            className="btn-primary flex-shrink-0 w-full sm:w-auto"
          >
            {postingComment ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-e-blue-700"></div>
            ) : (
              "Post"
            )}
          </button>
        </form>
      ) : (
        /* Message for non-logged-in users */
        <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600">
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </a>
            {" "}to post a comment
          </p>
        </div>
      )}

      {loading ? (
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments && comments.length > 0 &&
            comments.map((comment) => (
              <CommentCard key={comment.commentId?.timestamp || comment.commentId} {...comment} />
            ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
