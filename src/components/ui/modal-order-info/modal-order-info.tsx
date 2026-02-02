// import { useNavigate, useParams } from 'react-router-dom';
// import { selectFeedsOrderByNumber } from '../../../services/feeds/slices.';
// import { useAppSelector } from '../../../services/store';
// import { Modal } from '../../modal';
// import { OrderInfo } from '../../order-info';
// import { Preloader } from '../preloader';

// // Внутри App.tsx, выше return или в отдельном файле
// export const ModalOrderInfo = () => {
//   const { number } = useParams<{ number: string }>();
//   const navigate = useNavigate();
//   const orderNumber = number ? parseInt(number, 10) : 0;
//   const orderData = useAppSelector((state) =>
//     selectFeedsOrderByNumber(state, orderNumber)
//   );

//   const onClose = () => navigate(-1);

//   // Ждём, пока данные о заказе загрузятся
//   if (!orderData) {
//     return (
//       <Modal title='Заказ' onClose={onClose}>
//         <Preloader />
//       </Modal>
//     );
//   }

//   return (
//     <Modal title={`#${orderNumber}`} onClose={onClose}>
//       <OrderInfo />
//     </Modal>
//   );
// };
