import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import OnbordingPage from "./Pages/OnbordingPage";
import NotificationsPage from "./Pages/NotificationsPage";
import ChatPage from "./Pages/ChatPage";
import CallPage from "./Pages/CallPage";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import FriendsPage from "./Pages/FriendsPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import CommunityPage from "./Pages/CommunityPage.jsx";
import Aituttor from "./Pages/Aituttor.jsx";
import CommunityDetailPage from "./Pages/CommunityDetailPage.jsx";

import { axiosInstance } from "./lib/axios.js";
import useAuthUser from "./hooks/useAuthUser.js";
import useThemeStore from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnborded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      {/* <button onClick={() => setTheme(theme === "coffee" ? "forest" : "coffee")}>
        Toggle Theme
      </button> */}

      {/* <Button onClick={() => {
        return toast.error("hello world!")
      }}>create a toast</Button> */}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onbording"}
              />
            )
          }
        />


        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnborded ? "/" : "/onbording"} />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnborded ? "/" : "/onbording"} />
            )
          }
        />

        <Route
          path="/onbording"
          element={
            isAuthenticated ? (
              !isOnborded ? (
                <OnbordingPage />
              ) : (
                <Navigate  to="/" />
              )
            ) : (
              <Navigate  to="/login" />
            )
          }
        />
           <Route
          path="/notifications"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />
          <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onborded"} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isAuthenticated && isOnborded ? (
              <Navigate to="/friends" />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />
       <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnborded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />

        <Route
          path="/friends"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />


        <Route
          path="/profile"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <ProfilePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />

        <Route
          path="/community"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <CommunityPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }

         />

      

         <Route
          path="/Aituttor"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <Aituttor />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />

        <Route
          path="/communities/:id"
          element={
            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <CommunityDetailPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
            )
          }
        />

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
