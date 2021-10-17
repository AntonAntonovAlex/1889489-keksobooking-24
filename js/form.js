const getInactiveForm = () => {
  document.querySelector('.ad-form').classList.add('ad-form--disabled');
  document.querySelector('.ad-form-header').setAttribute('disabled', 'disabled');

  const allFormElements = document.querySelectorAll('.ad-form__element');
  allFormElements.forEach((formElement) => {
    formElement.setAttribute('disabled', 'disabled');
  });
  document.querySelector('.map__filters').classList.add('ad-form--disabled');
  document.querySelector('.map__features').setAttribute('disabled', 'disabled');
  const allFormFilters = document.querySelectorAll('.map__filter');
  allFormFilters.forEach((formFilter) => {
    formFilter.setAttribute('disabled', 'disabled');
  });
};
export{getInactiveForm};

const getActiveForm = () => {
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  document.querySelector('.ad-form-header').removeAttribute('disabled');

  const allFormElements = document.querySelectorAll('.ad-form__element');
  allFormElements.forEach((formElement) => {
    formElement.removeAttribute('disabled');
  });
  document.querySelector('.map__filters').classList.remove('ad-form--disabled');
  document.querySelector('.map__features').removeAttribute('disabled');
  const allFormFilters = document.querySelectorAll('.map__filter');
  allFormFilters.forEach((formFilter) => {
    formFilter.removeAttribute('disabled');
  });
};

export{getActiveForm};
