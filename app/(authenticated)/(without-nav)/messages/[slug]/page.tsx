import ThreadView from "@/components/message/thread/ThreadView";

export default function MessageThread({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="h-dvh overflow-y-auto no-scrollbar overscroll-contain">
      <ThreadView slug={params.slug} />
    </div>
  );
}