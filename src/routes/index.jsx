import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ExplorePage from "./pages/ExplorePage";
import ReelsPage from "./pages/ReelsPage";
import MessagesPage from "./pages/MessagePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ChangePassword from "./pages/ChangePassword";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import SearchPage from "./components/home/SearchBar";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import PostManagement from "./pages/admin/PostManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import NotificationPage from "./pages/client/NotificationPage";
import AccountPage from "./pages/admin/AccountPage";
import AdminRoute from "./pages/client/auth/AdminRoute";
import CreatePost from "./pages/client/CreatePost";
import PostDetail from "./components/layout/PostDetail";
import PostUpdatePage from "./pages/PostUpdatePage";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import PrivateRoute from "../pages/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // chứa Layout với Sidebar + BottomNav
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        ),
      },
    //   {
    //     path: "/explore",
    //     element: (
    //       <PrivateRoute>
    //         <ExplorePage />
    //       </PrivateRoute>
    //     ),
    //   },
    //   {
    //     path: "/reels",
    //     element: <ReelsPage />,
    //   },
      {
        path: "/notifications",
        element: (
          <PrivateRoute>
            <NotificationPage />
          </PrivateRoute>
        ),
      },
    //   {
    //     path: "/messages",
    //     element: <MessagesPage />,
    //   },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "/edit-profile",
        element: (
          <PrivateRoute>
            <ProfileEditPage />
          </PrivateRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        ),
      },
      {
        path: "/posts/:postId",
        element: (
          <PrivateRoute>
            <PostDetail />,
          </PrivateRoute>
        ),
      },
      {
        path: "/update/post/:id",
        element: (
          <PrivateRoute>
            <PostUpdatePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/create",
        element: (
          <PrivateRoute>
            {" "}
            <CreatePost />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgetpassword",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "posts",
        element: <PostManagement />,
      },
      {
        path: "reports",
        element: <ReportManagement />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
    ],
  },
]);

export default router;
