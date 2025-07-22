'use client';

import { Button } from '@comp/ui/button';
import { useQueryState } from 'nuqs';
import { T } from 'gt-next';

export function AssistantButton() {
  const [, setAssistantOpen] = useQueryState('assistant', {
    history: 'push',
    parse: (value) => value === 'true',
    serialize: (value) => value.toString(),
  });

  return (
    <Button variant="ghost" size="default" onClick={() => setAssistantOpen(true)}>
      <T>
        <span className="truncate">Ask a question...</span>
      </T>
      <kbd className="bg-muted ml-auto flex h-5 items-center gap-1 rounded-sm border px-1.5 font-mono text-[10px] font-medium">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
