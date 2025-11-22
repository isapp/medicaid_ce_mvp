import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/Checkbox"
import type { Campaign } from "@/types"

interface CreateCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: Partial<Campaign>) => void
}

export default function CreateCampaignDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCampaignDialogProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    type: "Reminder",
    subject: "",
    message: "",
    audience: "All Participants",
    channels: [] as string[],
    scheduledDate: "",
  })

  const handleChannelToggle = (channel: string) => {
    setFormData({
      ...formData,
      channels: formData.channels.includes(channel)
        ? formData.channels.filter((c) => c !== channel)
        : [...formData.channels, channel],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      ...formData,
      status: formData.scheduledDate ? "Scheduled" : "Draft",
      recipientCount: 0,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      sentDate: null,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isStarred: false,
    })
    onOpenChange(false)
    setFormData({
      name: "",
      type: "Reminder",
      subject: "",
      message: "",
      audience: "All Participants",
      channels: [],
      scheduledDate: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Create Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reminder">Reminder</SelectItem>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Alert">Alert</SelectItem>
                    <SelectItem value="Survey">Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Select
                value={formData.audience}
                onValueChange={(value) => setFormData({ ...formData, audience: value })}
              >
                <SelectTrigger id="audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Participants">All Participants</SelectItem>
                  <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Channels</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={formData.channels.includes("Email")}
                    onCheckedChange={() => handleChannelToggle("Email")}
                  />
                  <Label htmlFor="email" className="font-normal">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={formData.channels.includes("SMS")}
                    onCheckedChange={() => handleChannelToggle("SMS")}
                  />
                  <Label htmlFor="sms" className="font-normal">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="push"
                    checked={formData.channels.includes("Push")}
                    onCheckedChange={() => handleChannelToggle("Push")}
                  />
                  <Label htmlFor="push" className="font-normal">Push Notification</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                placeholder="Enter campaign message..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
