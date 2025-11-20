import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Send } from 'lucide-react';

export const BroadcastNew: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [recipientFilter, setRecipientFilter] = React.useState('all');
  const [scheduledDate, setScheduledDate] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/broadcasts');
  };

  const estimatedRecipients = recipientFilter === 'all' ? 1234 : recipientFilter === 'at-risk' ? 156 : 987;

  return (
    <AdminShell>
      <div className="broadcast-new">
        <div className="detail-header">
          <Button variant="secondary" onClick={() => navigate('/admin/broadcasts')}>
            <ArrowLeft size={16} />
            <span>Back to Broadcasts</span>
          </Button>
        </div>

        <Card className="broadcast-form-card">
          <h1>Create New Broadcast</h1>
          <p className="broadcast-form-description">Send a message to participants</p>

          <form onSubmit={handleSubmit} className="broadcast-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter broadcast title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows={8}
                required
              />
              <div className="form-help">
                Character count: {message.length} / 500
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="recipients">Recipients</label>
              <select
                id="recipients"
                className="form-select"
                value={recipientFilter}
                onChange={(e) => setRecipientFilter(e.target.value)}
              >
                <option value="all">All Participants</option>
                <option value="compliant">Compliant Participants</option>
                <option value="at-risk">At-Risk Participants</option>
                <option value="non-compliant">Non-Compliant Participants</option>
              </select>
              <div className="form-help">
                Estimated recipients: {estimatedRecipients}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="scheduled">Schedule (Optional)</label>
              <Input
                id="scheduled"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <div className="form-help">
                Leave empty to send immediately
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={() => navigate('/admin/broadcasts')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <Send size={16} />
                <span>{scheduledDate ? 'Schedule Broadcast' : 'Send Now'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminShell>
  );
};
