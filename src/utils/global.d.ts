// import 'react';

// declare module 'react' {
//   export interface HTMLAttributes<T> {
//     onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
//     onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
//   }
//   export interface RefAttributes<T> {
//     onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
//     onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
//   }
// }

import 'react';

declare module 'react' {
  /** Расширение HTMLAttributes для DOM-элементов */
  interface HTMLAttributes<T> {
    onPointerEnterCapture?: React.PointerEventHandler<T>;
    onPointerLeaveCapture?: React.PointerEventHandler<T>;
  }

  /** Расширение RefAttributes для компонентов с ref*/
  interface RefAttributes<T> {
    onPointerEnterCapture?: React.PointerEventHandler<T>;
    onPointerLeaveCapture?: React.PointerEventHandler<T>;
  }

  /** Расширение DOMAttributes для EventHandlers */
  interface DOMAttributes<T> {
    onPointerEnterCapture?: React.PointerEventHandler<T>;
    onPointerLeaveCapture?: React.PointerEventHandler<T>;
    onPointerDownCapture?: React.PointerEventHandler<T>;
    onPointerUpCapture?: React.PointerEventHandler<T>;
    onPointerMoveCapture?: React.PointerEventHandler<T>;
    onPointerCancelCapture?: React.PointerEventHandler<T>;
  }

  /** Расширение AllHTMLAttributes для EventHandlers */
  interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
    onPointerEnterCapture?: React.PointerEventHandler<T>;
    onPointerLeaveCapture?: React.PointerEventHandler<T>;
  }
}
