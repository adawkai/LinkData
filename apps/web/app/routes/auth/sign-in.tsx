import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../features/auth/authSlice";

export default function SignInRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const status = useAppSelector((s) => s.auth.status);
  const error = useAppSelector((s) => s.auth.error);
  const token = useAppSelector((s) => s.auth.accessToken);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      const next = search.get("next");
      navigate(next ? decodeURIComponent(next) : "/", { replace: true });
    }
  }, [token, navigate, search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ usernameOrEmail, password }));
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back. Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or email</Label>
              <Input
                id="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link to="/sign-up" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

