import React from 'react';
import { MessageSquare } from 'lucide-react';

export function NoMessages() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2">
      <MessageSquare className="h-8 w-8 text-blue-500" />
      <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
      <p className="text-zinc-500 text-sm">
        Ask your first question to get started.
      </p>
    </div>
  );
}
