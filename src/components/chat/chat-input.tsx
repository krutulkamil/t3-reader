import React from 'react';

interface ChatInputProps {
  isDisabled?: boolean;
}

export function ChatInput({ isDisabled = false }: Readonly<ChatInputProps>) {
  return <div>ChatInput</div>;
}
