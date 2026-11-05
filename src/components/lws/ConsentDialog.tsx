import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LegalBody } from "./LegalPage";
import { privacy, terms } from "@/lib/legal";

export const POLICY_VERSION = "2026-11";
export type LegalTab = "terms" | "privacy";

type Props = {
  open: boolean;
  busy?: boolean;
  /** "read" shows documents only; "consent" adds Decline / Accept. */
  mode?: "read" | "consent";
  initialTab?: LegalTab;
  onAccept?: () => void;
  onDecline?: () => void;
  onBack: () => void;
};

export function ConsentDialog({ open, busy = false, mode = "consent", initialTab = "terms", onAccept, onDecline, onBack }: Props) {
  const [tab, setTab] = useState<LegalTab>(initialTab);
  useEffect(() => { if (open) setTab(initialTab); }, [open, initialTab]);
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !busy) onBack(); }}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b p-5 pr-12 text-left">
          <DialogTitle className="font-display text-xl">Legal Documents & Privacy Consent</DialogTitle>
          <DialogDescription>
            {mode === "consent" ? "Please read both documents. Your account is only created after you accept." : "Read our Terms & Conditions and Privacy Policy."}
          </DialogDescription>
          <div role="tablist" className="mt-3 flex flex-wrap gap-2">
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
          {mode === "consent" && (
            <>
              <Button variant="outline" onClick={onDecline} disabled={busy}>Decline</Button>
              <Button onClick={onAccept} disabled={busy}>{busy ? "Creating account…" : "Accept"}</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
