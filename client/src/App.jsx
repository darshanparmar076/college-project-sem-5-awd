import { Outlet } from "react-router-dom";
import { Header } from "./components";
import { useEffect, useState } from "react";
import { getLogedInUser } from "./api";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/auth/authSlice";
import { Loader } from "./components";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    
    if (!token) {
      dispatch(logout());
      setLoading(false);
      return;
    }
    
    getLogedInUser()
      .then((response) => {
        if (response.statusCode === 200) {
          dispatch(login({
            user: response.data,
            userId: userId,
            token: token
          }));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return !loading ? (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader />
    </div>
  );
}

export default App;
