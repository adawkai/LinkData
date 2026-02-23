import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector } from "../../store/hooks";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.accessToken);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      const next = `${location.pathname}${location.search}${location.hash}`;
      navigate(`/sign-in?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [token, navigate, location]);

  if (!token) return null;
  return children;
}

