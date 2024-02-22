import React from 'react';

interface MessagesProps {
  fileId: string;
}

export function Messages({ fileId }: Readonly<MessagesProps>) {
  return <div>Messages</div>;
}
