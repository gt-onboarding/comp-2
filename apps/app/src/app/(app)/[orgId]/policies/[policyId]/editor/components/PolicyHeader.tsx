import { T, Branch } from 'gt-next';

interface PolicyHeaderProps {
  saveStatus: 'Saved' | 'Saving' | 'Unsaved';
}

export function PolicyHeader({ saveStatus }: PolicyHeaderProps) {
  return (
    <div className="mx-auto w-full">
      <div className="flex justify-end">
        <div className="bg-accent/60 flex items-center gap-1 rounded-sm px-2 py-1">
          <span className="text-muted-foreground text-xs">
            <T>
              <Branch
                branch={saveStatus}
                Saved="Saved"
                Saving="Saving"
                Unsaved="Unsaved"
              />
            </T>
          </span>
        </div>
      </div>
    </div>
  );
}
