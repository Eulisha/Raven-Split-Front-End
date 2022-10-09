import Swal from 'sweetalert2';

const currencyFormat = (num) => {
  //非數字或<0
  if (!Number(num) && Number(num) != 0) {
    return Swal.fire({
      title: 'Error!',
      text: 'Should be integer',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
  return (
    'NT$ ' +
    Number(num)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
};

export default currencyFormat;
