import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../ui/Dialog';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationUrl: string;
  activityId: string;
  onVerificationComplete?: () => void;
}

/**
 * VerificationModal Component
 *
 * Full-screen modal for employment verification via iv-cbv-payroll.
 * Uses existing Dialog component per figma-component-mapping.md guidelines.
 *
 * Follows mobile-first Figma design guidelines:
 * - 44px minimum touch targets (WCAG 2.1 AA)
 * - 16px base font size (prevents iOS zoom on focus)
 * - 4px baseline grid spacing
 * - Proper ARIA labels for screen readers (via Radix UI Dialog)
 * - Safe area support for device notches
 * - iOS-style modal presentation
 */
export function VerificationModal({
  isOpen,
  onClose,
  verificationUrl,
  onVerificationComplete
}: VerificationModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle messages from the verification iframe
   * Listens for postMessage events from iv-cbv-payroll
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    // Security: Only accept messages from CBV service origin
    const cbvOrigin = new URL(verificationUrl).origin;
    if (event.origin !== cbvOrigin) {
      return;
    }

    const { type, data } = event.data;

    switch (type) {
      case 'verification_complete':
        console.log('Verification completed:', data);
        onVerificationComplete?.();
        onClose();
        break;

      case 'verification_error':
        console.error('Verification error:', data);
        setError(data.message || 'Verification failed. Please try again.');
        break;

      case 'verification_cancelled':
        console.log('Verification cancelled by user');
        onClose();
        break;

      default:
        console.log('Unknown message type from verification iframe:', type);
    }
  }, [verificationUrl, onClose, onVerificationComplete]);

  /**
   * Set up message listener when modal opens
   */
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, handleMessage]);

  /**
   * Handle iframe load event
   */
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  /**
   * Handle iframe error
   */
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load verification page. Please try again.');
  };

  /**
   * Handle dialog close
   */
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setError(null);
      setIsLoading(true);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="verification-modal">
        <DialogHeader>
          <DialogTitle>Verify Your Employment</DialogTitle>
        </DialogHeader>

        <div className="verification-modal-content">
          {error && (
            <div className="verification-modal-error" role="alert">
              <p>{error}</p>
              <button
                onClick={onClose}
                className="btn btn--secondary"
                style={{ minHeight: '44px' }}
              >
                Close
              </button>
            </div>
          )}

          {isLoading && !error && (
            <div
              className="verification-modal-loading"
              role="status"
              aria-live="polite"
            >
              <div className="spinner" aria-hidden="true" />
              <p>Loading verification...</p>
            </div>
          )}

          <iframe
            src={verificationUrl}
            className="verification-modal-iframe"
            title="Employment Verification"
            allow="camera; microphone; geolocation"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: error ? 'none' : 'block' }}
          />
        </div>

        <div className="verification-modal-footer">
          <p className="verification-modal-help-text">
            Complete the steps to confirm your employment.
            This process typically takes 2-3 minutes.
          </p>
        </div>

        <style>{`
          /* Verification Modal Styles - Extends Dialog component with Figma guidelines */

          /* Override Dialog to be full-screen on mobile */
          .verification-modal {
            position: fixed;
            inset: 0;
            display: flex;
            flex-direction: column;
            max-width: 100vw;
            max-height: 100vh;
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            padding: 0;
            margin: 0;
          }

          /* Dialog Header - 4px baseline grid, safe area support */
          .verification-modal .dialog-header {
            padding: 12px 16px; /* 3× and 4× baseline */
            border-bottom: 1px solid var(--color-border, #e5e5ea);
            background: var(--color-background, #ffffff);
            flex-shrink: 0;
            /* Safe area support for notched devices */
            padding-top: max(12px, env(safe-area-inset-top));
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }

          /* Dialog Title - 20px/semibold per Figma mobile guidelines */
          .verification-modal .dialog-title {
            font-size: 20px;
            font-weight: 600;
            line-height: 1.3;
            color: var(--color-foreground, #1d1d1f);
            margin: 0;
          }

          /* Dialog Close Button - 44px touch target */
          .verification-modal .dialog-close {
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: background-color 0.2s;
            -webkit-tap-highlight-color: transparent;
          }

          .verification-modal .dialog-close:hover {
            background: var(--color-muted, #f2f2f7);
          }

          .verification-modal .dialog-close:active {
            background: var(--color-border, #e5e5ea);
            transform: scale(0.97);
          }

          /* Content Area - flex grow to fill space */
          .verification-modal-content {
            flex: 1;
            position: relative;
            overflow: hidden;
          }

          /* Iframe - full width/height */
          .verification-modal-iframe {
            width: 100%;
            height: 100%;
            border: none;
          }

          /* Loading State - centered */
          .verification-modal-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          }

          .verification-modal-loading .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--color-border, #e5e5ea);
            border-top-color: var(--color-primary, #007aff);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px; /* 4× baseline */
          }

          .verification-modal-loading p {
            font-size: 16px;
            line-height: 1.5;
            color: var(--color-muted-foreground, #6d6d70);
            margin: 0;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Error State - centered with action */
          .verification-modal-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            padding: 24px; /* 6× baseline */
            max-width: 90%;
          }

          .verification-modal-error p {
            font-size: 16px;
            line-height: 1.5;
            color: var(--color-destructive, #ff3b30);
            margin: 0 0 16px; /* 4× baseline */
          }

          /* Footer - safe area + 4px baseline */
          .verification-modal-footer {
            padding: 12px 16px; /* 3× and 4× baseline */
            border-top: 1px solid var(--color-border, #e5e5ea);
            background: var(--color-secondary, #f2f2f7);
            flex-shrink: 0;
            /* Safe area support */
            padding-bottom: max(12px, env(safe-area-inset-bottom));
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }

          .verification-modal-help-text {
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
            color: var(--color-muted-foreground, #6d6d70);
            text-align: center;
          }

          /* Reduced motion support - WCAG compliance */
          @media (prefers-reduced-motion: reduce) {
            .verification-modal .dialog-close:active {
              transform: none;
            }

            .spinner {
              animation-duration: 1.5s;
            }
          }

          /* Desktop/tablet breakpoint - restore normal modal sizing */
          @media (min-width: 768px) {
            .verification-modal {
              position: relative;
              inset: auto;
              width: 90vw;
              max-width: 800px;
              height: 90vh;
              border-radius: 12px;
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
            }

            .verification-modal .dialog-header {
              border-radius: 12px 12px 0 0;
            }

            .verification-modal-footer {
              border-radius: 0 0 12px 12px;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
