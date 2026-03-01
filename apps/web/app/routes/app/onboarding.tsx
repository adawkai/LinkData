import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateMyProfile } from "../../features/users/usersSlice";
import { uploadAvatar } from "../../shared/storage/s3";

function initials(username: string) {
  return username
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function OnboardingRoute() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const me = useAppSelector((s) => s.me.me);
  const status = useAppSelector((s) => s.users.status);
  const error = useAppSelector((s) => s.users.error);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (me?.name) setName(me.name);
  }, [me?.name]);

  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const currentAvatar = useMemo(() => {
    return localPreview ?? me?.profile?.avatarUrl ?? null;
  }, [localPreview, me?.profile?.avatarUrl]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) return;

    let avatarUrl = me.profile?.avatarUrl ?? null;
    try {
      if (file) {
        setUploading(true);
        const up = await uploadAvatar({ userId: me.id, file });
        avatarUrl = up.url;
      }
      await dispatch(
        updateMyProfile({
          name: name.trim() || undefined,
          avatarUrl,
        }),
      ).unwrap();
      navigate("/", { replace: true });
    } finally {
      setUploading(false);
    }
  };

  if (!me) return null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Finish your profile</CardTitle>
          <CardDescription>
            Add a name and an avatar so people recognize you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {currentAvatar ? <AvatarImage src={currentAvatar} alt={me.username} /> : null}
                <AvatarFallback className="text-lg">{initials(me.username) || "U"}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">
                  Uploads to LocalStack S3 and stores the public URL.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ada Lovelace"
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/", { replace: true })}
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={status === "loading" || uploading || !name.trim()}
              >
                {uploading ? "Uploading..." : status === "loading" ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

