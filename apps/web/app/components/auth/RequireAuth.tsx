import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector } from "../../store/hooks";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.accessToken);
  const me = useAppSelector((s) => s.me.me);
  const meStatus = useAppSelector((s) => s.me.status);
  const navigate = useNavigate();
  const location = useLocation();

  const isHydrating = !!token && !me && (meStatus === "idle" || meStatus === "loading");

  useEffect(() => {
    // Only redirect when we're sure there's no valid session
    if (!token && !isHydrating) {
      const next = `${location.pathname}${location.search}${location.hash}`;
      navigate(`/sign-in?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [token, isHydrating, navigate, location]);

  // Don't render children or redirect while verifying the token
  if (!token) return null;
  return children;
}

