import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import PrivateRoute from "../pages/PrivateRoute";
import PostCreatePage from "../pages/PostCreatePage";
import MainLayout from "../layouts/MainLayout";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfileEditPage from "../pages/ProfileEditPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ForgetPasswordPage from "../pages/ForgetPasswordPage";
import SearchPage from "../pages/SearchPage";
import NotificationPage from "../pages/NotificationPage";
import PostDetailPage from "../pages/PostDetailPage";
import PostUpdatePage from "../pages/PostUpdatePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
            <ChangePasswordPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/posts/:postId",
        element: (
          <PrivateRoute>
            <PostDetailPage />,
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
            <PostCreatePage />
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
  // {
  //   path: "/admin",
  //   element: (
  //     <AdminRoute>
  //       <AdminLayout />
  //     </AdminRoute>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: "users",
  //       element: <UserManagement />,
  //     },
  //     {
  //       path: "posts",
  //       element: <PostManagement />,
  //     },
  //     {
  //       path: "reports",
  //       element: <ReportManagement />,
  //     },
  //     {
  //       path: "account",
  //       element: <AccountPage />,
  //     },
  //   ],
  // },
]);

export default router;
