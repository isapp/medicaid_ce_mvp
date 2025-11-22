import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { Separator } from '../../components/ui/Separator';

export const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'data' | 'attestation' | 'modules'>('data');
  const [selectedState, setSelectedState] = React.useState('CA');
  const [attestationTemplate, setAttestationTemplate] = React.useState(
    'I hereby attest that the information provided is accurate and complete to the best of my knowledge.'
  );
  const [autoVerification, setAutoVerification] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);
  const [caseManagement, setCaseManagement] = React.useState(true);
  const [reporting, setReporting] = React.useState(true);
  const [broadcasts, setBroadcasts] = React.useState(true);

  const handleSave = () => {
    console.log('Settings saved');
  };

  return (
    <AdminShell>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="py-6 space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground">
              Configure system settings, attestation templates, and feature modules
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="data" className="text-sm font-medium">Data Settings</TabsTrigger>
              <TabsTrigger value="attestation" className="text-sm font-medium">Attestation</TabsTrigger>
              <TabsTrigger value="modules" className="text-sm font-medium">Modules</TabsTrigger>
            </TabsList>

            {/* Data Settings Tab */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader className="pb-6">
                  <h2 className="text-lg font-medium">General Settings</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-relaxed text-foreground">
                      State Configuration
                    </label>
                    <Select
                      value={selectedState}
                      onValueChange={setSelectedState}
                      options={[
                        { value: 'CA', label: 'California' },
                        { value: 'NY', label: 'New York' },
                        { value: 'TX', label: 'Texas' },
                        { value: 'FL', label: 'Florida' },
                      ]}
                    />
                    <p className="text-xs font-normal leading-snug text-muted-foreground">
                      Select the state for compliance rules and reporting
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-relaxed text-foreground">
                      Data Retention Period (days)
                    </label>
                    <Input type="number" defaultValue="365" />
                    <p className="text-xs font-normal leading-snug text-muted-foreground">
                      Number of days to retain participant data
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-relaxed text-foreground">
                      Export Format
                    </label>
                    <Select
                      defaultValue="csv"
                      options={[
                        { value: 'csv', label: 'CSV' },
                        { value: 'xlsx', label: 'Excel (XLSX)' },
                        { value: 'json', label: 'JSON' },
                      ]}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-6">
                  <h2 className="text-lg font-medium">Notification Settings</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-relaxed text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-relaxed text-foreground">
                        SMS Notifications
                      </p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">
                        Send SMS notifications to participants
                      </p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attestation Settings Tab */}
            <TabsContent value="attestation" className="space-y-6">
              <Card>
                <CardHeader className="pb-6">
                  <h2 className="text-lg font-medium">Attestation Template</h2>
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                    Customize the attestation text shown to participants
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-relaxed text-foreground">
                      Template Text
                    </label>
                    <Textarea
                      value={attestationTemplate}
                      onChange={(e) => setAttestationTemplate(e.target.value)}
                      rows={6}
                      placeholder="Enter attestation template text..."
                    />
                    <p className="text-xs font-normal leading-snug text-muted-foreground">
                      This text will be displayed when participants submit their verification
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="primary" onClick={handleSave}>Save Template</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-6">
                  <h2 className="text-lg font-medium">Verification Settings</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-relaxed text-foreground">
                        Auto-Verification
                      </p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">
                        Automatically verify submissions that meet criteria
                      </p>
                    </div>
                    <Switch checked={autoVerification} onCheckedChange={setAutoVerification} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-relaxed text-foreground">
                      Minimum Hours Required
                    </label>
                    <Input type="number" defaultValue="80" />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-relaxed text-foreground">
                      Verification Deadline (days)
                    </label>
                    <Input type="number" defaultValue="30" />
                    <p className="text-xs font-normal leading-snug text-muted-foreground">
                      Number of days participants have to submit verification
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modules Settings Tab */}
            <TabsContent value="modules" className="space-y-6">
              <Card>
                <CardHeader className="pb-6">
                  <h2 className="text-lg font-medium">Feature Modules</h2>
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                    Enable or disable system features
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-relaxed text-foreground">
                        Case Management
                      </p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">
                        Enable case tracking and management features
                      </p>
                    </div>
                    <Switch checked={caseManagement} onCheckedChange={setCaseManagement} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-relaxed text-foreground">
                        Reporting & Analytics
                      </p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">
                        Enable advanced reporting and analytics dashboard
                      </p>
                    </div>
                    <Switch checked={reporting} onCheckedChange={setReporting} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-relaxed text-foreground">
                        Broadcast Campaigns
                      </p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">
                        Enable campaign management and messaging features
                      </p>
                    </div>
                    <Switch checked={broadcasts} onCheckedChange={setBroadcasts} />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="primary" onClick={handleSave}>Save Module Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminShell>
  );
};
