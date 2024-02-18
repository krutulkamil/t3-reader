import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from "next/navigation";

import { db } from '@/db';

interface FilePageProps {
  params: {
    fileid: string;
  };
}

export default async function FilePage({ params }: Readonly<FilePageProps>) {
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) redirect(`/auth-callback?origin=dashboard/${fileid}`);

  const file = await db.file.findFirst({
    where: { id: fileid, userId: user.id },
  });

  if (!file) notFound();

  return (
    <div>
      <p>{fileid}</p>
    </div>
  );
}
