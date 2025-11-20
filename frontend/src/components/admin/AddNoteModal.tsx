import React from 'react';
import { Dialog, DialogContent, DialogClose } from '../ui/Dialog';
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNoteText('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="add-note-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <DialogClose asChild>
            <button className="modal-close-button">
              <X size={20} />
            </button>
          </DialogClose>
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
          <DialogClose asChild>
            <Button variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!noteText.trim()}>
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
