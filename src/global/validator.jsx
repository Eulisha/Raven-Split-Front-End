import Swal from 'sweetalert2';
const validator = (formRef) => {
  const form = formRef.current;
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i];

    if (element.tagName !== 'button' && element.willValidate && !element.validity.valid) {
      if (element.validity.valueMissing) {
        return Swal.fire({
          title: 'Error!',
          text: `${element.validationMessage.replace('。', '：')}${element.title}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
        // setErrMsg({ [element.name]: element.validationMessage });
      } else {
        return Swal.fire({
          title: 'Error!',
          text: `${element.validationMessage}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  }
};

export default validator;
