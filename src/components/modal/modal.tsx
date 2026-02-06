import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalUI } from '@ui';
import { TModalProps } from './type';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    /* Вызов callback onClose при закрытии модального окна по Esc
      (для возврата к предыдущему маршруту) */
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
