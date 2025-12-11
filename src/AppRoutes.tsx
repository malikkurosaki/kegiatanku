// ⚡ AUTO-GENERATED — DO NOT EDIT
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Skeleton } from "@mantine/core";

const SkeletonLoading = () => {
  return (
    <div style={{ padding: "20px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} height={70} radius="md" animate={true} mb="sm" />
      ))}
    </div>
  );
};

/**
 * Prefetch lazy component:
 * - Hover
 * - Visible (viewport)
 * - Browser idle
 */
export function attachPrefetch(el: HTMLElement | null, preload: () => void) {
  if (!el) return;
  let done = false;

  const run = () => {
    if (done) return;
    done = true;
    preload();
  };

  // 1) On hover
  el.addEventListener("pointerenter", run, { once: true });

  // 2) On visible (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    if (entries && entries[0] && entries[0].isIntersecting) {
      run();
      io.disconnect();
    }
  });
  io.observe(el);

  // 3) On idle
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => run());
  } else {
    setTimeout(run, 200);
  }
}

const ShalatLayout = {
  Component: React.lazy(() => import("./pages/shalat/shalat_layout")),
  preload: () => import("./pages/shalat/shalat_layout"),
};

const ShalatPage = {
  Component: React.lazy(() => import("./pages/shalat/shalat_page")),
  preload: () => import("./pages/shalat/shalat_page"),
};

const Login = {
  Component: React.lazy(() => import("./pages/Login")),
  preload: () => import("./pages/Login"),
};

const Home = {
  Component: React.lazy(() => import("./pages/Home")),
  preload: () => import("./pages/Home"),
};

const Register = {
  Component: React.lazy(() => import("./pages/Register")),
  preload: () => import("./pages/Register"),
};

const DashboardShalatPage = {
  Component: React.lazy(
    () => import("./pages/dashboard/shalat/dashboard-shalat_page"),
  ),
  preload: () => import("./pages/dashboard/shalat/dashboard-shalat_page"),
};

const DashboardShalatLayout = {
  Component: React.lazy(
    () => import("./pages/dashboard/shalat/dashboard-shalat_layout"),
  ),
  preload: () => import("./pages/dashboard/shalat/dashboard-shalat_layout"),
};

const ConfigLayout = {
  Component: React.lazy(() => import("./pages/dashboard/config/config_layout")),
  preload: () => import("./pages/dashboard/config/config_layout"),
};

const ConfigPage = {
  Component: React.lazy(() => import("./pages/dashboard/config/config_page")),
  preload: () => import("./pages/dashboard/config/config_page"),
};

const ApikeyPage = {
  Component: React.lazy(() => import("./pages/dashboard/apikey/apikey_page")),
  preload: () => import("./pages/dashboard/apikey/apikey_page"),
};

const DashboardPage = {
  Component: React.lazy(() => import("./pages/dashboard/dashboard_page")),
  preload: () => import("./pages/dashboard/dashboard_page"),
};

const DashboardLayout = {
  Component: React.lazy(() => import("./pages/dashboard/dashboard_layout")),
  preload: () => import("./pages/dashboard/dashboard_layout"),
};

const ProfileLayout = {
  Component: React.lazy(() => import("./pages/profile/Profile_layout")),
  preload: () => import("./pages/profile/Profile_layout"),
};

const ProfilePage = {
  Component: React.lazy(() => import("./pages/profile/Profile_page")),
  preload: () => import("./pages/profile/Profile_page"),
};

const NotFound = {
  Component: React.lazy(() => import("./pages/NotFound")),
  preload: () => import("./pages/NotFound"),
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shalat" element={<ShalatLayout.Component />}>
          <Route index element={<ShalatPage.Component />} />

          <Route
            path="/shalat/shalat"
            element={
              <React.Suspense fallback={<SkeletonLoading />}>
                <ShalatPage.Component />
              </React.Suspense>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <React.Suspense fallback={<SkeletonLoading />}>
              <Login.Component />
            </React.Suspense>
          }
        />

        <Route
          path="/"
          element={
            <React.Suspense fallback={<SkeletonLoading />}>
              <Home.Component />
            </React.Suspense>
          }
        />

        <Route
          path="/register"
          element={
            <React.Suspense fallback={<SkeletonLoading />}>
              <Register.Component />
            </React.Suspense>
          }
        />

        <Route path="/dashboard" element={<DashboardLayout.Component />}>
          <Route index element={<DashboardPage.Component />} />

          <Route
            path="/dashboard/shalat"
            element={<DashboardShalatLayout.Component />}
          >
            <Route
              index
              element={
                <Navigate
                  to="/dashboard/shalat/dashboard-shalat_page"
                  replace
                />
              }
            />

            <Route
              path="/dashboard/shalat/dashboard-shalat"
              element={
                <React.Suspense fallback={<SkeletonLoading />}>
                  <DashboardShalatPage.Component />
                </React.Suspense>
              }
            />
          </Route>

          <Route path="/dashboard/config" element={<ConfigLayout.Component />}>
            <Route index element={<ConfigPage.Component />} />

            <Route
              path="/dashboard/config/config"
              element={
                <React.Suspense fallback={<SkeletonLoading />}>
                  <ConfigPage.Component />
                </React.Suspense>
              }
            />
          </Route>

          <Route
            path="/dashboard/apikey/apikey"
            element={
              <React.Suspense fallback={<SkeletonLoading />}>
                <ApikeyPage.Component />
              </React.Suspense>
            }
          />

          <Route
            path="/dashboard/dashboard"
            element={
              <React.Suspense fallback={<SkeletonLoading />}>
                <DashboardPage.Component />
              </React.Suspense>
            }
          />
        </Route>

        <Route path="/profile" element={<ProfileLayout.Component />}>
          <Route index element={<ProfilePage.Component />} />

          <Route
            path="/profile/profile"
            element={
              <React.Suspense fallback={<SkeletonLoading />}>
                <ProfilePage.Component />
              </React.Suspense>
            }
          />
        </Route>

        <Route
          path="/*"
          element={
            <React.Suspense fallback={<SkeletonLoading />}>
              <NotFound.Component />
            </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
