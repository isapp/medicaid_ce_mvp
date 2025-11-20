import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentUrl: string;
  documentType: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentName,
  documentUrl,
  documentType,
}) => {
  const [zoom, setZoom] = React.useState(100);

  const handleDownload = () => {
    window.open(documentUrl, '_blank');
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 25));
  };

  const isImage = documentType.startsWith('image/');
  const isPDF = documentType === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content document-viewer-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{documentName}</h2>
            <div className="document-viewer-actions">
              <Button variant="secondary" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut size={16} />
              </Button>
              <span className="zoom-level">{zoom}%</span>
              <Button variant="secondary" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn size={16} />
              </Button>
              <Button variant="secondary" onClick={handleDownload}>
                <Download size={16} />
              </Button>
              <button className="modal-close-button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="modal-body document-viewer-body">
            {isImage && (
              <img
                src={documentUrl}
                alt={documentName}
                style={{ width: `${zoom}%`, maxWidth: 'none' }}
              />
            )}
            {isPDF && (
              <iframe
                src={documentUrl}
                title={documentName}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            )}
            {!isImage && !isPDF && (
              <div className="document-viewer-unsupported">
                <p>Preview not available for this file type.</p>
                <Button onClick={handleDownload}>
                  <Download size={16} />
                  <span>Download File</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
