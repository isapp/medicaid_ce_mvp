import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  title?: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title = 'Add Note',
}) => {
  const [noteText, setNoteText] = React.useState('');

  const handleSave = () => {
    if (noteText.trim()) {
      onSave(noteText);
      setNoteText('');
      onClose();
    }
  };

  const handleCancel = () => {
    setNoteText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="modal-overlay" onClick={handleCancel}>
        <div className="modal-content add-note-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close-button" onClick={handleCancel}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="note-text">Note</label>
              <textarea
                id="note-text"
                className="form-textarea"
                rows={6}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
                autoFocus
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!noteText.trim()}>
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
