import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"

interface ExtendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExtend: (newDate: string, reason: string) => void
  participantName?: string
  currentDueDate?: string
}

export default function ExtendDialog({
  open,
  onOpenChange,
  onExtend,
  participantName,
  currentDueDate,
}: ExtendDialogProps) {
  const [newDate, setNewDate] = React.useState("")
  const [reason, setReason] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExtend(newDate, reason)
    onOpenChange(false)
    setNewDate("")
    setReason("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Extend Deadline</DialogTitle>
          <DialogDescription className="text-sm font-normal leading-relaxed text-muted-foreground">
            {participantName
              ? `Extend the deadline for ${participantName}`
              : "Extend the deadline for this participant"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {currentDueDate && (
              <div className="space-y-1">
                <Label className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase">
                  Current Due Date
                </Label>
                <p className="text-sm font-normal leading-relaxed text-foreground">
                  {new Date(currentDueDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newDate">New Due Date</Label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Extension</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Explain why the deadline is being extended..."
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Extend Deadline</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
