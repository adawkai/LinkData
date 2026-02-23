import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createPost, fetchFeed } from "../../features/feed/feedSlice";

function timeAgo(iso: string) {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (Number.isNaN(s)) return iso;
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}

export default function FeedRoute() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.feed.items);
  const status = useAppSelector((s) => s.feed.status);
  const error = useAppSelector((s) => s.feed.error);

  const [content, setContent] = useState("");

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  const onPost = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setContent("");
    await dispatch(createPost({ content: trimmed }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What’s happening?"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{content.length}/280</p>
            <Button onClick={onPost} disabled={status === "loading" || !content.trim()}>
              Post
            </Button>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {status === "loading" && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading feed…</p>
        ) : null}

        {items.map((p) => (
          <Card key={p.id}>
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <Link
                  to={`/u/${p.username}`}
                  className="text-sm font-medium hover:underline"
                >
                  @{p.username}
                </Link>
                <span className="text-xs text-muted-foreground">{timeAgo(p.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.content}</p>
            </CardContent>
          </Card>
        ))}

        {status !== "loading" && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your feed is empty. Follow someone and their posts will show up here.
          </p>
        ) : null}
      </div>
    </div>
  );
}

