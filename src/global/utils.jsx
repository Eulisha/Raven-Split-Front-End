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

// const fetchNewData = () => {
//   const fetchDebts = async (gid) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const { data } = await axios.get(`${constants.API_GET_DEBTS}/${gid}?paging=${paging}`, {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('BACKEND for setDebts: ', data.data);
//       setDebt(data.data);
//     } catch (err) {
//       if (!err.response.data) {
//         //網路錯誤
//         Swal.fire({
//           title: 'Error!',
//           text: 'Network Connection failed, please try later...',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//       } else {
//         Swal.fire({
//           title: 'Error!',
//           text: 'Internal Server Error',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//       }
//     }
//   };
// };

export default { currencyFormat };
