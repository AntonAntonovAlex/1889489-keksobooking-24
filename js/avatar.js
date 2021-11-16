const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const fileChooser = document.querySelector('#avatar');
const preview = document.querySelector('.ad-form-header__preview').querySelector('img');
const fileChooserHousing = document.querySelector('#images');
const previewHousingContainer = document.querySelector('.ad-form__photo');

fileChooser.addEventListener('change', () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    preview.src = URL.createObjectURL(file);
  }
});

fileChooserHousing.addEventListener('change', () => {
  const file = fileChooserHousing.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewHousingContainer.append(document.createElement('img'));
    const previewHousing = previewHousingContainer.querySelector('img');
    previewHousing.classList.add('ad-form__photo');
    previewHousing.src = URL.createObjectURL(file);
  }
});

