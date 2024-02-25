import React, { useContext, useRef } from 'react';
import { Send } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChatContext } from '@/components/contexts/chat-context';

interface ChatInputProps {
  isDisabled?: boolean;
}

export function ChatInput({ isDisabled = false }: Readonly<ChatInputProps>) {
  const { message, addMessage, isLoading, handleInputChange } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleEnterKeyPress(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addMessage();

      textareaRef.current?.focus();
    }
  }

  function handleButtonClick() {
    addMessage();
    textareaRef.current?.focus();
  }

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                placeholder="Enter your question..."
                rows={1}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                onKeyDown={handleEnterKeyPress}
                value={message}
                ref={textareaRef}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />

              <Button
                aria-label="send message"
                className="absolute bottom-1.5 right-[8px]"
                disabled={isDisabled || isLoading || !message}
                onClick={handleButtonClick}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
