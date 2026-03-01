import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { RequireAuth } from "../../components/auth/RequireAuth";
import { AppShell } from "../../components/layout/AppShell";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMe } from "../../features/me/meSlice";

function isProfileComplete(user: { name: string | null } | null) {
  return !!user?.name;
}

export default function AppLayoutRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useAppSelector((s) => s.auth.accessToken);
  const me = useAppSelector((s) => s.me.me);
  const meStatus = useAppSelector((s) => s.me.status);

  // Load /users/me when we have a token (important after refresh)
  useEffect(() => {
    if (!token) return;
    if (!me && meStatus === "idle") void dispatch(fetchMe());
  }, [token, me, meStatus, dispatch]);

  // If fetching user fails for any reason, redirect to sign-in but keep the token
  useEffect(() => {
    if (!token || meStatus !== "failed") return;
    const next = `${location.pathname}${location.search}${location.hash}`;
    navigate(`/sign-in?next=${encodeURIComponent(next)}`, { replace: true });
  }, [token, meStatus, navigate, location]);

  // Onboarding redirect (only after user data is loaded)
  useEffect(() => {
    if (!token || !me || meStatus !== "idle") return;
    const inOnboarding = location.pathname.startsWith("/onboarding");
    if (!inOnboarding && !isProfileComplete(me)) {
      navigate("/onboarding", { replace: true });
    }
  }, [token, me, meStatus, location.pathname, navigate]);

  return (
    <RequireAuth>
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  );
}
