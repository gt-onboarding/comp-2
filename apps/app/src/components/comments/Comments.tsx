import type { Attachment, Comment, Member, User } from '@comp/db/types';
import { CommentEntityType } from '@comp/db/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@comp/ui/card';
import { T, Var } from 'gt-next';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

export type CommentWithAuthor = Comment & {
  author: Member & {
    user: User;
  };
  attachments: Attachment[];
};

export const Comments = ({
  entityId,
  entityType,
  comments,
}: {
  entityId: string;
  entityType: CommentEntityType;
  comments: CommentWithAuthor[];
}) => {
  return (
    <Card>
      <CardHeader>
        <T>
          <CardTitle>Comments</CardTitle>
        </T>
        <T>
          <CardDescription>Leave a comment on this <Var>{entityType}</Var></CardDescription>
        </T>
      </CardHeader>
      <CardContent className="space-y-4">
        <CommentList comments={comments} />
        <CommentForm entityId={entityId} entityType={entityType} />
      </CardContent>
    </Card>
  );
};
