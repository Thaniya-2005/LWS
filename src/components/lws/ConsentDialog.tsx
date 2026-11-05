import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LegalBody } from "./LegalPage";
import { privacy, terms } from "@/lib/legal";

export const POLICY_VERSION = "2026-11";

export function ConsentDialog({ open, busy, onAccept, onDecline, onBack }: { open: boolean; busy: boolean; onAccept: () => void; onDecline: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<"terms" | "privacy">("terms");
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !busy) onBack(); }}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b p-5 text-left">
          <DialogTitle className="font-display text-xl">Data Privacy & Legal Consent</DialogTitle>
          <DialogDescription>Please read both documents. Your account is only created after you accept.</DialogDescription>
          <div role="tablist" className="mt-3 flex gap-2">
            {([["terms", "Terms & Conditions"], ["privacy", "Privacy Policy"]] as const).map(([k, l]) => (
              <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-5" key={tab}>
          <LegalBody doc={tab === "terms" ? terms : privacy} />
        </div>
        <div className="flex flex-col-reverse gap-2 border-t bg-card p-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onBack} disabled={busy}>Back</Button>
          <Button variant="outline" onClick={onDecline} disabled={busy}>Decline</Button>
          <Button onClick={onAccept} disabled={busy}>{busy ? "Creating account…" : "Accept & create account"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
