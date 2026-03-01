import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Card, CardContent } from "../../../components/ui/card";
import type { Post } from "../types";

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

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card key={post.id}>
      <CardContent className="flex gap-4 p-6">
        <Link to={`/u/${post.author.username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.profile?.avatarUrl ?? undefined} />
            <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                to={`/u/${post.author.username}`}
                className="text-sm font-semibold hover:underline"
              >
                {post.author.name || post.author.username}
              </Link>
              <span className="text-xs text-muted-foreground">
                @{post.author.username}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {post.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
