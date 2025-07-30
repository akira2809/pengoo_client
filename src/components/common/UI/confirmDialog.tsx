// app/components/common/UI/confirmDialog.ts
import Swal from 'sweetalert2';

export const confirmCancelOrder = async () => {
  const result = await Swal.fire({
    title: 'Huỷ đơn hàng?',
    text: 'Bạn có chắc chắn muốn huỷ đơn hàng này không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Huỷ đơn',
    cancelButtonText: 'Không',
  });

  return result.isConfirmed;
};

export const confirmRemoveAll = async () => {
  const result = await Swal.fire({
    title: 'Xoá tất cả sản phẩm?',
    text: 'Bạn có chắc chắn muốn xoá toàn bộ sản phẩm khỏi danh sách yêu thích không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Xoá tất cả',
    cancelButtonText: 'Huỷ',
  });

  return result.isConfirmed;
};

export const confirmRemoveSelected = async () => {
  const result = await Swal.fire({
    title: 'Xoá các sản phẩm đã chọn?',
    text: 'Bạn có chắc chắn muốn xoá các sản phẩm đã chọn khỏi danh sách yêu thích không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ',
  });

  return result.isConfirmed;
};