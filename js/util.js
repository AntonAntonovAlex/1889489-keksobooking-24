function getRandomNumber(min, max) {
  if (max<0 || min<0) {
    return alert('Значения должны быть больше нуля');
  }
  if (max<=min) {
    return alert('Неверное условие');
  }
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomNumberComma(min, max, comma) {
  if (max<0 || min<0 || comma<0) {
    return alert('Значения должны быть больше нуля');
  }
  if (max<=min) {
    return alert('Неверное условие');
  }
  const num = (Math.random() * (max - min) + min);
  return +num.toFixed(comma);
}

const getRound = (value) => (value % 1 === 0) ? Math.round(value) : value;

export {getRound, getRandomNumber, getRandomNumberComma};
