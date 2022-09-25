const currencyFormat = (num) => {
  return 'NT$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export default currencyFormat;
