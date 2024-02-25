import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  createContext,
  type ReactNode,
} from 'react';
import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';

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

  const utils = trpc.useUtils();
  const { toast } = useToast();

  const backupMessage = useRef('');

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
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage('');

      await utils.getFileMessages.cancel();

      const previousMessages = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const newPages = [...old.pages];
          const latestPage = newPages[0];

          latestPage.messages = [
            {
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
              createdAt: new Date().toISOString(),
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
  });

  const addMessage = useCallback(() => {
    sendMessage({ message });
    setMessage('');
  }, [sendMessage, message]);

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
    [addMessage, message, isLoading]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
