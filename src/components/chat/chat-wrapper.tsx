import React from 'react';

import { Messages } from '@/components/chat/messages';
import { ChatInput } from '@/components/chat/chat-input';

export function ChatWrapper() {
  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>

      <ChatInput />
    </div>
  );
}
