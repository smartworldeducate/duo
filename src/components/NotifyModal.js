"use client";
import { useState } from "react";
import { Send, Loader2, Bell } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import * as data from "@/lib/data/service";
import { useFeedback } from "@/components/ui/Feedback";
import { BRAND } from "@/lib/constants";

/**
 * Shared notification composer. Pass either:
 *   - target = a user object   → sends to that member
 *   - target = "all" + allIds  → broadcasts to everyone
 */
export default function NotifyModal({ open, onClose, target, allIds = [] }) {
  const { toast } = useFeedback();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const isBroadcast = target === "all";
  const name = isBroadcast ? `all ${allIds.length} members` : target?.personalInfo?.fullName;

  const close = () => {
    setTitle("");
    setBody("");
    onClose();
  };

  const send = async () => {
    if (!body.trim()) return;
    setBusy(true);
    try {
      const ids = isBroadcast ? allIds : [target.userId];
      await data.adminSendNotification(ids, title.trim() || BRAND, body.trim());
      toast(`Notification sent to ${name}.`);
      close();
    } catch (e) {
      toast(e?.message || "Could not send notification.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Send notification"
      subtitle={target ? `To ${name}` : ""}
      footer={
        <>
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button onClick={send} disabled={busy || !body.trim()}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {busy ? "Sending…" : "Send"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3">
          <div className="h-9 w-9 rounded-lg grad-heart flex items-center justify-center text-white shrink-0">
            <Bell size={17} />
          </div>
          <p className="text-xs text-brand-700 font-medium">
            {isBroadcast
              ? "This message is delivered to every member's in-app inbox."
              : "This message lands in the member's in-app notification inbox."}
          </p>
        </div>
        <div>
          <label className="block text-[13px] font-bold text-ink-soft mb-1.5">Title (optional)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New feature!" className="field-input" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-ink-soft mb-1.5">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message…"
            rows={4}
            className="field-input"
          />
        </div>
      </div>
    </Modal>
  );
}
