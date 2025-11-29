import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getUserPosts, getUserProfile } from "../api/index";
import {
  Container,
  BlogCard,
  LogoutBtn,
  FollowBtn,
  Loader,
} from "../components/index";
import { FaEdit } from "react-icons/fa";

function Profile() {
  const { userName } = useParams();

  const [userData, setUserData] = useState({});
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stateUserData = useSelector((state) => state.auth.data);

  useEffect(() => {
    (async () => {
      try {
        const [userProfileResponse, userPostResponse] = await Promise.all([
          getUserProfile(userName),
          getUserPosts(userName),
        ]);

        setUserData(userProfileResponse.data);
        setBlogs(userPostResponse.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || "Failed to load profile";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  }, [userName]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="my-10">
        <Container>
          <div className="card">
            <p className="text-center text-xl font-semibold text-red-600">{error}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="my-10 min-h-screen">
      <Container>
        <div className="card">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="sticky top-5 flex flex-col items-center gap-4 rounded-2xl bg-gray-100 border border-gray-200 p-6 md:items-start">
                <div>
                  <img
                    className="h-24 w-24 rounded-2xl object-cover ring-2 ring-gray-300"
                    src={userData.avtar}
                    alt={userData.name}
                  />
                </div>
                <div className="flex flex-col items-center gap-2 md:items-start">
                  <p className="text-2xl font-bold text-gray-900">{userData.name}</p>
                  <p className="text-base text-gray-600">@{userData.userName}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{userData.followers}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{userData.following}</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                </div>
                {/* Debug the comparison */}
                {console.log('🔍 Profile comparison:', {
                  'userData._id': userData._id,
                  'stateUserData._id': stateUserData._id,
                  'userData.userName': userData.userName,
                  'stateUserData.userName': stateUserData.userName,
                  'comparison result': userData._id == stateUserData._id,
                  'userName comparison': userData.userName === stateUserData.userName
                })}
                {/* Use multiple comparison methods for reliability */}
                {(userData._id && stateUserData._id && String(userData._id) === String(stateUserData._id)) || 
                 (userData.userName && stateUserData.userName && userData.userName === stateUserData.userName) ? (
                  <div className="flex flex-col gap-3 w-full">
                    <Link
                      to="/edit-user"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white hover:text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <FaEdit className="h-4 w-4 text-white hover:text-white" />
                      Edit
                    </Link>
                    <LogoutBtn />
                  </div>
                ) : (
                  <FollowBtn userData={userData} setUserData={setUserData} />
                )}
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-1 gap-6 md:col-span-2">
              <div>
                {blogs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {blogs.map((blog) => (
                      <BlogCard key={blog._id} {...blog} />
                    ))}
                  </div>
                ) : (
                  <div className="card text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Posts Found</h2>
                    <p className="text-gray-600">This user hasn't posted any blogs yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
