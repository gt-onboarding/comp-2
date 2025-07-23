import Link from 'next/link';
import { T } from 'gt-next';

export default async function NotFound() {
  return (
    <div className="text-muted-foreground flex h-dvh flex-col items-center justify-center text-center text-sm">
      <T><h2 className="mb-2 text-xl font-semibold">404 - Page not found</h2></T>
      <T><p className="mb-4">The page you are looking for does not exist.</p></T>
      <Link href="/" className="underline">
        <T>Return to dashboard</T>
      </Link>
    </div>
  );
}
