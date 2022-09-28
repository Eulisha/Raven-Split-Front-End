import Swal from 'sweetalert2';
const validator = (formRef) => {
  const form = formRef.current;
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i];

    if (element.tagName !== 'button' && element.willValidate && !element.validity.valid) {
      if (element.validity.valueMissing) {
        console.log('if');
        return Swal.fire({
          title: 'Error!',
          text: `${element.validationMessage.replace('。', '：')}${element.title}`,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
        // setErrMsg({ [element.name]: element.validationMessage });
      } else {
        console.log('else');
        return Swal.fire({
          title: 'Error!',
          text: `${element.validationMessage}`,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      }
    }
  }
};

export default validator;
