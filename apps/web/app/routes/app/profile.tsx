import { useEffect } from "react";
import { useParams } from "react-router";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserByUsername, fetchProfileByUserId } from "../../features/profiles/profilesSlice";
import {
  blockUser,
  cancelFollowRequest,
  followUser,
  unblockUser,
  unfollowUser,
} from "../../features/relations/relationsSlice";

function initials(username: string) {
  return username
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProfileRoute() {
  const { username = "" } = useParams();
  const dispatch = useAppDispatch();

  const me = useAppSelector((s) => s.me.me);
  const usersByUsername = useAppSelector((s) => s.profiles.usersByUsername);
  const profilesByUserId = useAppSelector((s) => s.profiles.profilesByUserId);
  const profStatus = useAppSelector((s) => s.profiles.status);
  const profError = useAppSelector((s) => s.profiles.error);
  const relationsByUserId = useAppSelector((s) => s.relations.byUserId);

  const user = usersByUsername[username];
  const profile = user ? profilesByUserId[user.id] : undefined;
  const rel = user ? relationsByUserId[user.id] : undefined;
  const relStatus = useAppSelector((s) => s.relations.status);
  const relError = useAppSelector((s) => s.relations.error);

  useEffect(() => {
    if (!username) return;
    void dispatch(fetchUserByUsername({ username }));
  }, [username, dispatch]);

  useEffect(() => {
    if (!user) return;
    if (!profilesByUserId[user.id]) void dispatch(fetchProfileByUserId({ userId: user.id }));
  }, [user, profilesByUserId, dispatch]);

  if (!username) {
    return <p className="text-sm text-muted-foreground">Missing username.</p>;
  }

  if (profStatus === "loading" && !user) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  if (profStatus === "failed" && !user) {
    return <p className="text-sm text-destructive">{profError ?? "Failed to load user."}</p>;
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found.</p>;
  }

  const isMe = me?.id === user.id;
  const isBlocked = rel?.blocked ?? false;
  const followStatus = rel?.followStatus ?? "NONE";

  const onFollow = () => dispatch(followUser({ targetUserId: user.id }));
  const onUnfollow = () => dispatch(unfollowUser({ targetUserId: user.id }));
  const onCancel = () => dispatch(cancelFollowRequest({ targetUserId: user.id }));
  const onBlock = () => dispatch(blockUser({ targetUserId: user.id }));
  const onUnblock = () => dispatch(unblockUser({ targetUserId: user.id }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              {profile?.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={user.username} /> : null}
              <AvatarFallback className="text-base">{initials(user.username) || "U"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl">
                {profile?.name ?? user.username}
              </CardTitle>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {!isMe ? (
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              {isBlocked ? (
                <Button
                  variant="secondary"
                  onClick={onUnblock}
                  disabled={relStatus === "loading"}
                >
                  Unblock
                </Button>
              ) : (
                <>
                  {followStatus === "FOLLOWING" ? (
                    <Button
                      variant="secondary"
                      onClick={onUnfollow}
                      disabled={relStatus === "loading"}
                    >
                      Unfollow
                    </Button>
                  ) : followStatus === "REQUESTED" ? (
                    <Button
                      variant="secondary"
                      onClick={onCancel}
                      disabled={relStatus === "loading"}
                    >
                      Requested (Cancel)
                    </Button>
                  ) : (
                    <Button onClick={onFollow} disabled={relStatus === "loading"}>
                      Follow
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={onBlock}
                    disabled={relStatus === "loading"}
                  >
                    Block
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Posts</p>
            <p className="text-lg font-semibold">{user.postCount}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="text-lg font-semibold">{user.followersCount}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Following</p>
            <p className="text-lg font-semibold">{user.followingCount}</p>
          </div>
          {relError ? (
            <p className="col-span-3 text-sm text-destructive">{relError}</p>
          ) : null}
        </CardContent>
      </Card>

      {profile ? null : (
        <p className="text-sm text-muted-foreground">
          Loading profile details…
        </p>
      )}
    </div>
  );
}

