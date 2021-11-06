import { clearForm, disableFilter, enableFilter, showEror, showSuccess } from './form.js';
import { showAlert } from './util.js';

const getData = (onSuccess) => {
  fetch('https://24.javascript.pages.academy/keksobooking/data')
    .then((response) => {
      if (response.ok) {
        enableFilter();
        return response.json();
      } else {
        throw new Error('Не удалось загрузить объявления. Попробуйте перезагрузить страницу');
      }
    })
    .then((announcements) => {
      onSuccess(announcements);
    })
    .catch((err) => {
      showAlert(err);
      disableFilter();
    });
};

const sendData = (body) => {
  fetch(
    'https://24.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        showSuccess();
        clearForm();
      } else {
        showEror();
      }
    });
};


export {getData, sendData};
