const useLocalStorage = () => {
  const setValue = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getValue = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const removeValue = (key: string) => {
    localStorage.removeItem(key);
  };

  return { setValue, getValue, removeValue };
};

export default useLocalStorage;
