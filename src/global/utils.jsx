const currencyFormat = (num) => {
  if (!num) {
    num = 0;
  }
  return 'NT$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export default currencyFormat;
