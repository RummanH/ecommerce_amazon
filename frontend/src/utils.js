export const getError = (err) => {
  console.log(err.message);
  return err.response && err.response.data.message
    ? err.response.data.message
    : err.message;
};

export const addToLocalStorage = (data, name) => {
  localStorage.setItem(name, JSON.stringify(data));
};
