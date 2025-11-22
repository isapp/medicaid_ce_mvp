import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"

interface GenerateAuditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (config: AuditConfig) => void
}

interface AuditConfig {
  reportType: string
  dateRange: {
    start: string
    end: string
  }
  includeParticipants: boolean
  includeCases: boolean
  includeOrganizations: boolean
  includeCampaigns: boolean
  format: string
}

export default function GenerateAuditDialog({
  open,
  onOpenChange,
  onGenerate,
}: GenerateAuditDialogProps) {
  const [config, setConfig] = React.useState<AuditConfig>({
    reportType: "Full Audit",
    dateRange: {
      start: "",
      end: "",
    },
    includeParticipants: true,
    includeCases: true,
    includeOrganizations: true,
    includeCampaigns: true,
    format: "PDF",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(config)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Generate Audit Report</DialogTitle>
          <DialogDescription className="text-sm font-normal leading-relaxed text-muted-foreground">
            Configure and generate a comprehensive audit report
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={config.reportType}
                onValueChange={(value) => setConfig({ ...config, reportType: value })}
              >
                <SelectTrigger id="reportType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Audit">Full Audit</SelectItem>
                  <SelectItem value="Compliance Report">Compliance Report</SelectItem>
                  <SelectItem value="Activity Summary">Activity Summary</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={config.dateRange.start}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      dateRange: { ...config.dateRange, start: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={config.dateRange.end}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      dateRange: { ...config.dateRange, end: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Include Sections</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="participants"
                    checked={config.includeParticipants}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeParticipants: checked as boolean })
                    }
                  />
                  <Label htmlFor="participants" className="font-normal">
                    Participants
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cases"
                    checked={config.includeCases}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeCases: checked as boolean })
                    }
                  />
                  <Label htmlFor="cases" className="font-normal">
                    Cases
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organizations"
                    checked={config.includeOrganizations}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeOrganizations: checked as boolean })
                    }
                  />
                  <Label htmlFor="organizations" className="font-normal">
                    Organizations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campaigns"
                    checked={config.includeCampaigns}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeCampaigns: checked as boolean })
                    }
                  />
                  <Label htmlFor="campaigns" className="font-normal">
                    Campaigns
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={config.format}
                onValueChange={(value) => setConfig({ ...config, format: value })}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Generate Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
