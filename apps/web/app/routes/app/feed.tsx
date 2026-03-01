import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createPost, fetchFeed } from "../../features/feed/feedSlice";
import { PostCard } from "../../features/feed/components/PostCard";

export default function FeedRoute() {
  const dispatch = useAppDispatch();
  const { items, status, error, hasMore, nextCursor } = useAppSelector((s) => s.feed);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (items.length === 0 && status === "idle") {
      void dispatch(fetchFeed({ reset: true }));
    }
  }, [dispatch, items.length, status]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && status === "idle") {
          void dispatch(fetchFeed({ cursor: nextCursor }));
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [dispatch, nextCursor, hasMore, status]);

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
          <PostCard key={p.id} post={p} />
        ))}

        {status !== "loading" && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your feed is empty. Follow someone and their posts will show up here.
          </p>
        ) : null}

        {status === "loading" && items.length > 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Loading more posts…</p>
        ) : null}

        <div ref={observerTarget} className="h-1" />
      </div>
    </div>
  );
}
