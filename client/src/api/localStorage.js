const isAvailable = () => {
  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

const getItem = (item, byDefault = null) => isAvailable()
  ? JSON.parse(window.localStorage.getItem(item))
  : byDefault;

const setItem = (item, value) => isAvailable() && window.localStorage.setItem(item, JSON.stringify(value));

const ls = {
  isAvailable,
  getItem,
  setItem,
};

export default ls;
