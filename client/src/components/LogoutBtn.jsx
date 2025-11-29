import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../api/index";
import { logout } from "../features/auth/authSlice";

function LogoutBtn() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);
    const logoutToast = toast.loading("Logging out...");

    try {
      const response = await logoutUser();
      dispatch(logout());

      toast.success(response.message || "User Logout successfully", {
        id: logoutToast,
      });

      // Redirect to home page after successful logout
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Error while logout user";
      toast.error(errorMessage, {
        id: logoutToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-3 text-white hover:text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {loading ? (
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
      ) : (
        <>
          <FaSignOutAlt className="h-4 w-4 text-white hover:text-white" />
          Log out
        </>
      )}
    </button>
  );
}

export default LogoutBtn;
