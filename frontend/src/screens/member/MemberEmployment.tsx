import { useState } from 'react';
import { VerificationModal } from '../../components/member/VerificationModal';
import {
  createEmploymentActivity,
  initiateVerification,
  pollVerificationStatus,
  type CreateActivityRequest,
  type EmploymentActivity
} from '../../api/employment-verification';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

/**
 * MemberEmployment Screen
 *
 * Allows members to report employment activities and verify them
 * via the iv-cbv-payroll integration.
 */
export function MemberEmployment() {
  const [activities, setActivities] = useState<EmploymentActivity[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateActivityRequest>({
    employer_name: '',
    hours_worked: 0,
    activity_date: new Date().toISOString().split('T')[0]
  });

  // Get auth token and beneficiary ID from context/store
  // TODO: Replace with actual auth context
  const token = 'your-auth-token-here';
  const beneficiaryId = 'your-beneficiary-id-here';

  /**
   * Handle form field changes
   */
  const handleChange = (field: keyof CreateActivityRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handle creating a new employment activity
   */
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const activity = await createEmploymentActivity(beneficiaryId, formData, token);
      setActivities(prev => [activity, ...prev]);

      // Reset form
      setFormData({
        employer_name: '',
        hours_worked: 0,
        activity_date: new Date().toISOString().split('T')[0]
      });

      // Automatically initiate verification for the new activity
      handleInitiateVerification(activity.id);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create activity');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Handle initiating verification for an activity
   */
  const handleInitiateVerification = async (activityId: string) => {
    setError(null);
    setIsVerifying(true);
    setSelectedActivityId(activityId);

    try {
      const result = await initiateVerification(activityId, token);
      setVerificationUrl(result.verification_url);

      // Start polling for status updates
      pollVerificationStatus(activityId, token, (status) => {
        console.log('Verification status updated:', status);

        // Update activity in list
        setActivities(prev =>
          prev.map(a =>
            a.id === activityId
              ? { ...a, verification_status: status.verificationStatus }
              : a
          )
        );

        // Close modal if verification is complete
        if (status.verificationStatus !== 'pending') {
          handleCloseModal();
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to initiate verification');
      setIsVerifying(false);
    }
  };

  /**
   * Handle closing verification modal
   */
  const handleCloseModal = () => {
    setVerificationUrl(null);
    setSelectedActivityId(null);
    setIsVerifying(false);
  };

  /**
   * Handle verification completion
   */
  const handleVerificationComplete = () => {
    console.log('Verification completed successfully');
    // Optionally show success message
  };

  /**
   * Get badge variant for verification status
   */
  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <ScreenLayout title="Report Employment" showBack={true} showMenu={true}>
      <div className="member-employment">
        <p className="screen-description">Add your employment activities and verify your income.</p>

        {/* Add Employment Activity Form */}
        <Card className="employment-form-card">
          <CardHeader>
            <h2>Add Employment Activity</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateActivity}>
              <div className="form-group">
                <label htmlFor="employer_name">Employer Name</label>
                <Input
                  id="employer_name"
                  type="text"
                  value={formData.employer_name}
                  onChange={(e) => handleChange('employer_name', e.target.value)}
                  placeholder="Enter employer name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hours_worked">Hours Worked</label>
                <Input
                  id="hours_worked"
                  type="number"
                  min="0"
                  max="168"
                  step="0.5"
                  value={formData.hours_worked}
                  onChange={(e) => handleChange('hours_worked', parseFloat(e.target.value))}
                  placeholder="Enter hours worked"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity_date">Activity Date</label>
                <Input
                  id="activity_date"
                  type="date"
                  value={formData.activity_date}
                  onChange={(e) => handleChange('activity_date', e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="form-error">
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add Activity & Verify'}
              </Button>
            </form>
          </CardContent>
        </Card>

      {/* Activities List */}
      <div className="activities-section">
        <h2>Your Employment Activities</h2>

        {activities.length === 0 ? (
          <Card>
            <CardContent>
              <p className="empty-state">
                No employment activities yet. Add your first activity above!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="activities-list">
            {activities.map((activity) => (
              <Card key={activity.id} className="activity-card">
                <CardContent>
                  <div className="activity-header">
                    <h3>{activity.employer_name}</h3>
                    <Badge variant={getStatusBadgeVariant(activity.verification_status)}>
                      {activity.verification_status}
                    </Badge>
                  </div>

                  <div className="activity-details">
                    <p>
                      <strong>Hours:</strong> {activity.hours_worked}
                    </p>
                    <p>
                      <strong>Date:</strong> {activity.activity_date}
                    </p>
                  </div>

                  {activity.verification_status === 'pending' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleInitiateVerification(activity.id)}
                      disabled={isVerifying}
                    >
                      Complete Verification
                    </Button>
                  )}

                  {activity.verification_status === 'failed' && (
                    <Button
                      variant="primary"
                      onClick={() => handleInitiateVerification(activity.id)}
                      disabled={isVerifying}
                    >
                      Retry Verification
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

        {/* Verification Modal */}
        {verificationUrl && selectedActivityId && (
          <VerificationModal
            isOpen={!!verificationUrl}
            onClose={handleCloseModal}
            verificationUrl={verificationUrl}
            activityId={selectedActivityId}
            onVerificationComplete={handleVerificationComplete}
          />
        )}
      </div>
    </ScreenLayout>
  );
}
