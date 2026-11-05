import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LegalBody } from "./LegalPage";
import { privacy, terms } from "@/lib/legal";

export const POLICY_VERSION = "2026-11";
export type LegalTab = "terms" | "privacy";

const TITLES: Record<LegalTab, string> = { terms: "Terms & Conditions", privacy: "Privacy Policy" };

type Props = {
  open: boolean;
  /** Which single document this container shows. */
  doc: LegalTab;
  busy?: boolean;
  /** "read" shows the document only; "consent" adds Decline / Accept. */
  mode?: "read" | "consent";
  /** Optional step label, e.g. "Step 1 of 2". */
  step?: string;
  acceptLabel?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onBack: () => void;
};

export function ConsentDialog({ open, doc, busy = false, mode = "read", step, acceptLabel = "Accept", onAccept, onDecline, onBack }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !busy) onBack(); }}>
      <DialogContent key={doc} className="flex max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b p-5 pr-12 text-left">
          {step && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{step}</p>}
          <DialogTitle className="font-display text-xl">{TITLES[doc]}</DialogTitle>
          <DialogDescription>
            {mode === "consent" ? `Please read and accept the ${TITLES[doc]}. Your account is only created after you accept both documents.` : `The complete LWS ${TITLES[doc]}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <LegalBody doc={doc === "terms" ? terms : privacy} />
        </div>
        <div className="flex flex-col-reverse gap-2 border-t bg-card p-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onBack} disabled={busy}>Back</Button>
          {mode === "consent" && (
            <>
              <Button variant="outline" onClick={onDecline} disabled={busy}>Decline</Button>
              <Button onClick={onAccept} disabled={busy}>{busy ? "Creating account…" : acceptLabel}</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
