import type { ReactNode } from 'react';
import Styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={Styles.closeButton} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}