import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject: (reason: string, notes: string) => void
  participantName?: string
}

export default function RejectDialog({
  open,
  onOpenChange,
  onReject,
  participantName,
}: RejectDialogProps) {
  const [reason, setReason] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReject(reason, notes)
    onOpenChange(false)
    setReason("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Reject Verification</DialogTitle>
          <DialogDescription className="text-sm font-normal leading-relaxed text-muted-foreground">
            {participantName
              ? `Mark ${participantName} as insufficient`
              : "Mark this participant as insufficient"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incomplete Documentation">Incomplete Documentation</SelectItem>
                  <SelectItem value="Invalid Hours">Invalid Hours</SelectItem>
                  <SelectItem value="Missing Signature">Missing Signature</SelectItem>
                  <SelectItem value="Expired Documents">Expired Documents</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Provide details about the rejection..."
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Reject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
