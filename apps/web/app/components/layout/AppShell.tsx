import { Link, useLocation, useNavigate } from "react-router";
import { Home, LogOut, Settings, User, Users } from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import { clearMe } from "../../features/me/meSlice";
import { clearProfiles } from "../../features/profiles/profilesSlice";
import { clearFeed } from "../../features/feed/feedSlice";
import { clearRelations } from "../../features/relations/relationsSlice";

function initials(username: string) {
  return username
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.me.me);
  const myProfile = useAppSelector((s) => s.profiles.myProfile);

  const onLogout = () => {
    dispatch(logout());
    dispatch(clearMe());
    dispatch(clearProfiles());
    dispatch(clearFeed());
    dispatch(clearRelations());
    navigate("/sign-in");
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              ms
            </span>
            <span className="hidden sm:inline">mini-social</span>
          </Link>

          <nav className="flex items-center gap-2">
            {me ? (
              <>
                <Link
                  to="/feed"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent",
                    location.pathname.startsWith("/feed") && "bg-accent",
                  )}
                >
                  <Home />
                </Link>
                <Link
                  to="/network"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent",
                    location.pathname.startsWith("/network") && "bg-accent",
                  )}
                >
                  <Users />
                </Link>
                <Link
                  to={`/u/${me.username}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent",
                    location.pathname.startsWith("/u/") && "bg-accent",
                  )}
                >
                  <Avatar className="h-7 w-7">
                    {myProfile?.avatarUrl ? (
                      <AvatarImage
                        src={myProfile.avatarUrl}
                        alt={me.username}
                      />
                    ) : null}
                    <AvatarFallback>
                      {initials(me.username) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">@{me.username}</span>
                </Link>

                <Link to="/settings">
                  <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  aria-label="Logout"
                >
                  <LogOut />
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost" className="gap-2">
                    <User />
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
