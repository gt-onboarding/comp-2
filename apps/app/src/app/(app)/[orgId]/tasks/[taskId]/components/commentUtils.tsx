import { AttachmentType } from '@comp/db/types';
import { FileAudio, FileQuestion, FileText, FileVideo } from 'lucide-react';
import type { InlineTranslationOptions } from 'gt-next/types';

// Formats a date object into relative time string (e.g., "5m ago")
export function formatRelativeTime(date: Date, t: (content: string, options?: InlineTranslationOptions) => string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return t('{seconds}s ago', { seconds: diffInSeconds });
  if (diffInMinutes < 60) return t('{minutes}m ago', { minutes: diffInMinutes });
  if (diffInHours < 24) return t('{hours}h ago', { hours: diffInHours });
  return t('{days}d ago', { days: diffInDays });
}

// Returns a Lucide icon component based on AttachmentType
export function getIconForAttachmentType(type: AttachmentType) {
  switch (type) {
    case AttachmentType.document:
      return <FileText className="text-muted-foreground h-8 w-8 shrink-0" />;
    case AttachmentType.video:
      return <FileVideo className="text-muted-foreground h-8 w-8 shrink-0" />;
    case AttachmentType.audio:
      return <FileAudio className="text-muted-foreground h-8 w-8 shrink-0" />;
    case AttachmentType.image:
      return null;
    default:
      return <FileQuestion className="text-muted-foreground h-8 w-8 shrink-0" />;
  }
}
