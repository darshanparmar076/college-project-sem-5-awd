import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ThemedToaster from "./components/ThemedToaster.jsx";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Blogs from "./pages/Blogs.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import EditPost from "./pages/EditPost.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import EditUser from "./pages/EditUser.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/u/:userName",
        element: <Profile />,
      },
      {
        path: "/blog/:blogId",
        element: <Blog />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/create-post",
        element: <CreateBlog />,
      },
      {
        path: "/blog/edit/:blogId",
        element: <EditPost />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/edit-user",
        element: <EditUser />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ThemedToaster />
  </Provider>
);
