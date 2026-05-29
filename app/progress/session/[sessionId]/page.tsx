import { PageHeader } from "@/components/PageHeader";
import { SessionEditor } from "@/components/progress/session/SessionEditor";

type ProgressSessionPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function ProgressSessionPage({
  params,
}: ProgressSessionPageProps) {
  const { sessionId } = await params;

  return (
    <>
      <PageHeader title="Edit Session" />
      <SessionEditor sessionId={sessionId} />
    </>
  );
}
