'use client';

import { Button } from '@comp/ui/button';
import NextError from 'next/error';
import Link from 'next/link';
import { getLocale } from "gt-next/server";
import { GTProvider, T } from "gt-next";

export default async function GlobalError({ error, reset }: {error: Error;reset: () => void;}) {
  return (
  <html lang={await getLocale()}>
      <body><GTProvider>
        <div className="h-[calc(100vh-200px)] w-full">
          <div className="flex h-full flex-col items-center justify-center">
            <T>
              <div className="mt-8 mb-8 flex flex-col items-center justify-between text-center">
                <h2 className="mb-4 font-medium">Something went wrong</h2>
                <p className="text-sm text-[#878787]">
                  An unexpected error has occurred. Please try again
                  <br /> or contact support if the issue persists.
                </p>
              </div>
            </T>

            <div className="flex space-x-4">
              <T>
                <Button onClick={() => reset()} variant="outline">
                  Try again
                </Button>
              </T>

              <Link href="/account/support">
                <T>
                  <Button>Contact us</Button>
                </T>
              </Link>
            </div>

            <NextError statusCode={0} />
          </div>
        </div>
      </GTProvider></body>
    </html>
  );
}