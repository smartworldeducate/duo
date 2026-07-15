"use client";
import { useMemo, useState } from "react";
import { MessagesSquare, Search, Mic, Play } from "lucide-react";
import { useChatRooms, useMessages, useUsers } from "@/hooks/useCollection";
import { buildUserMap, nameOf, photoOf } from "@/lib/selectors";
import { timeAgo, formatDateTime } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function MessagesPage() {
  const { data: rooms, loading } = useChatRooms();
  const { data: messages } = useMessages();
  const { data: users } = useUsers();
  const userMap = useMemo(() => buildUserMap(users), [users]);
  const [activeId, setActiveId] = useState(null);
  const [q, setQ] = useState("");

  const sortedRooms = useMemo(
    () => [...rooms].sort((a, b) => b.lastMessageTime - a.lastMessageTime),
    [rooms]
  );

  const filteredRooms = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sortedRooms;
    return sortedRooms.filter((r) =>
      r.userIds.some((id) => nameOf(userMap, id).toLowerCase().includes(term))
    );
  }, [sortedRooms, q, userMap]);

  const active = activeId ? rooms.find((r) => r.chatRoomId === activeId) : filteredRooms[0];
  const thread = useMemo(
    () =>
      active
        ? messages.filter((m) => m.chatRoomId === active.chatRoomId).sort((a, b) => a.createdAt - b.createdAt)
        : [],
    [messages, active]
  );

  const pairLabel = (r) => r.userIds.map((id) => nameOf(userMap, id)).join("  ·  ");

  return (
    <div>
      <PageHeader title="Conversations" subtitle="Oversee member conversations for safety and support." />

      {loading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : rooms.length === 0 ? (
        <div className="card"><EmptyState icon={MessagesSquare} title="No conversations yet" subtitle="Matched members' chats will appear here." /></div>
      ) : (
        <div className="card overflow-hidden grid grid-cols-1 lg:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[480px]">
          {/* Room list */}
          <div className="border-r border-[var(--border)] flex flex-col min-h-0">
            <div className="p-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 bg-[var(--bg)] rounded-lg h-9 px-3">
                <Search size={15} className="text-muted" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" className="flex-1 bg-transparent outline-none text-sm text-plum placeholder:text-muted min-w-0" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredRooms.map((r) => {
                const isActive = active?.chatRoomId === r.chatRoomId;
                const [a, b] = r.userIds;
                return (
                  <button
                    key={r.chatRoomId}
                    onClick={() => setActiveId(r.chatRoomId)}
                    className={`w-full flex items-center gap-3 p-3 text-left border-b border-[var(--border)] transition cursor-pointer ${
                      isActive ? "bg-brand-50" : "hover:bg-brand-50/50"
                    }`}
                  >
                    <div className="flex -space-x-3 shrink-0">
                      <Avatar src={photoOf(userMap, a)} name={nameOf(userMap, a)} size={38} className="ring-2 ring-white" />
                      <Avatar src={photoOf(userMap, b)} name={nameOf(userMap, b)} size={38} className="ring-2 ring-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-plum truncate">{pairLabel(r)}</div>
                      <div className="text-xs text-muted truncate">{r.lastMessage}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-muted">{timeAgo(r.lastMessageTime)}</span>
                      {r.unread > 0 && (
                        <span className="h-5 min-w-5 px-1 rounded-full grad-heart text-white text-[10px] font-bold flex items-center justify-center">
                          {r.unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread */}
          <div className="hidden lg:flex flex-col min-h-0 bg-[var(--bg)]">
            {active ? (
              <>
                <div className="p-4 border-b border-[var(--border)] bg-white flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {active.userIds.map((id) => (
                      <Avatar key={id} src={photoOf(userMap, id)} name={nameOf(userMap, id)} size={36} className="ring-2 ring-white" />
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-plum text-sm">{pairLabel(active)}</div>
                    <div className="text-xs text-muted">{thread.length} messages · started {timeAgo(active.createdAt)}</div>
                  </div>
                  <Badge tone="rose" className="ml-auto">Read-only</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {thread.length === 0 ? (
                    <p className="text-center text-sm text-muted mt-10">No messages in this conversation.</p>
                  ) : (
                    thread.map((m) => {
                      const mine = m.senderId === active.userIds[0];
                      const isImage = m.messageType === "image";
                      return (
                        <div key={m.messageId} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[70%] ${mine ? "" : "items-end"} flex flex-col`}>
                            <div
                              className={`text-sm overflow-hidden ${
                                isImage
                                  ? "rounded-2xl border border-[var(--border)] bg-white"
                                  : `rounded-2xl px-4 py-2.5 ${
                                      mine
                                        ? "bg-white text-plum border border-[var(--border)] rounded-tl-md"
                                        : "grad-heart text-white rounded-tr-md"
                                    }`
                              }`}
                            >
                              <MessageContent m={m} mine={mine} />
                            </div>
                            <span className="text-[10px] text-muted mt-1 px-1">
                              {nameOf(userMap, m.senderId)} · {formatDateTime(m.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <EmptyState icon={MessagesSquare} title="Select a conversation" subtitle="Choose a thread to view its messages." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageContent({ m, mine }) {
  if (m.messageType === "image") {
    return (
      <a href={m.message} target="_blank" rel="noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.message}
          alt="Shared photo"
          loading="lazy"
          className="max-w-[240px] w-full max-h-72 object-cover"
        />
      </a>
    );
  }
  if (m.messageType === "voice") {
    return (
      <span className="flex items-center gap-2">
        <span className={`h-7 w-7 rounded-full flex items-center justify-center ${mine ? "bg-brand-50 text-brand-500" : "bg-white/25 text-white"}`}>
          <Play size={13} fill="currentColor" />
        </span>
        <Mic size={14} className="opacity-70" />
        <span className="font-medium">Voice message</span>
      </span>
    );
  }
  return <span className="whitespace-pre-wrap break-words">{m.message}</span>;
}
