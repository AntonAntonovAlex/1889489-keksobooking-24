function fetchData(url, method, onSuccess, onError, body) {
  fetch(
    url,
    {
      method: method,
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error;
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => {
      onError();
    });
}

export {fetchData};
