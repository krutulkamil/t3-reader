import React, { useState, useMemo, createContext, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
});

interface ChatContextProviderProps {
  fileId: string;
  children: ReactNode;
}

export function ChatContextProvider({
  fileId,
  children,
}: Readonly<ChatContextProviderProps>) {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ message, fileId }),
      });

      if (!response.ok) {
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
      }

      return response.body;
    },
  });

  function addMessage() {
    return sendMessage({ message });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  const contextValue = useMemo(
    () => ({
      addMessage,
      message,
      handleInputChange,
      isLoading,
    }),
    [addMessage, message, handleInputChange, isLoading]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
