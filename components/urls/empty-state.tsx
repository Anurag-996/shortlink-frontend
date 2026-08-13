import { LinkIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAction?: () => void;
  actionText?: string;
}

export function EmptyState({
  onAction,
  actionText = "Shorten a URL",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-12 px-6 text-center dark:border-neutral-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 mb-3">
        <LinkIcon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        No short URLs yet
      </h3>
      <p className="mt-1 max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
        Create your first short link above to track clicks and share compact URLs.
      </p>
      {onAction && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
