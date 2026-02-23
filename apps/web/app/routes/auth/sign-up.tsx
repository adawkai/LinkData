import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register } from "../../features/auth/authSlice";

export default function SignUpRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((s) => s.auth.status);
  const error = useAppSelector((s) => s.auth.error);
  const token = useAppSelector((s) => s.auth.accessToken);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) navigate("/onboarding", { replace: true });
  }, [token, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(register({ email, username, password }));
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join mini-social in a minute.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                autoComplete="new-password"
                required
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Creating..." : "Sign up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

