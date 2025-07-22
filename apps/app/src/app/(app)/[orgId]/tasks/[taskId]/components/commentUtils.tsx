import { AttachmentType } from '@comp/db/types';
import { FileAudio, FileQuestion, FileText, FileVideo } from 'lucide-react';
import { useGT } from 'gt-next';

// Formats a date object into relative time string (e.g., "5m ago")
export function formatRelativeTime(date: Date): string {
  // Note: This function is used in client components, but we need to access t() here
  // This requires the component using this function to pass the translation function
  // For now, keeping the original strings as these are very short time units
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
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
