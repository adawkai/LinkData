import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { RequireAuth } from "../../components/auth/RequireAuth";
import { AppShell } from "../../components/layout/AppShell";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import { fetchMe } from "../../features/me/meSlice";
import { fetchProfileByUserId } from "../../features/profiles/profilesSlice";

function isProfileComplete(profile: { name: string | null } | null) {
  return !!profile?.name;
}

export default function AppLayoutRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useAppSelector((s) => s.auth.accessToken);
  const me = useAppSelector((s) => s.me.me);
  const meStatus = useAppSelector((s) => s.me.status);
  const meError = useAppSelector((s) => s.me.error);
  const myProfile = useAppSelector((s) => s.profiles.myProfile);

  // Load /users/me when we have a token (important after refresh)
  useEffect(() => {
    if (!token) return;
    if (!me && meStatus === "idle") void dispatch(fetchMe());
  }, [token, me, meStatus, dispatch]);

  // If token is invalid, API returns 401; make that a clean logout.
  useEffect(() => {
    if (!token) return;
    if (meStatus === "failed" && meError?.toLowerCase().includes("401")) {
      dispatch(logout());
      navigate("/sign-in", { replace: true });
    }
  }, [token, meStatus, meError, dispatch, navigate]);

  // Load my profile (for onboarding + avatar in navbar)
  useEffect(() => {
    if (!token || !me) return;
    if (!myProfile) void dispatch(fetchProfileByUserId({ userId: me.id, asMyProfile: true }));
  }, [token, me, myProfile, dispatch]);

  // Onboarding redirect (only after profile is loaded)
  useEffect(() => {
    if (!token || !me || !myProfile) return;
    const inOnboarding = location.pathname.startsWith("/onboarding");
    if (!inOnboarding && !isProfileComplete(myProfile)) {
      navigate("/onboarding", { replace: true });
    }
  }, [token, me, myProfile, location.pathname, navigate]);

  return (
    <RequireAuth>
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  );
}

