import { useState } from "react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updatePrivacy } from "../../features/me/meSlice";

export default function SettingsRoute() {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.me.me);
  const status = useAppSelector((s) => s.me.status);
  const error = useAppSelector((s) => s.me.error);

  const [isPrivate, setIsPrivate] = useState<boolean>(me?.isPrivate ?? false);

  if (!me) return null;

  const onSave = async () => {
    await dispatch(updatePrivacy({ isPrivate })).unwrap();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Privacy and account options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="privacy">Private account</Label>
              <p className="text-sm text-muted-foreground">
                Private accounts require follow requests to be accepted.
              </p>
            </div>
            <input
              id="privacy"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={status === "loading"}>
              {status === "loading" ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

