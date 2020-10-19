import { pad } from '@util/core.util';

const timezonedTime = () => {
  const date = new Date();
  const dateString = date.toLocaleString();
  // 'YYYY-MM-DD HH:mm:ss',
  // const dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return dateString;
};

const getTime = () => {
  const date = new Date();
  const year = pad(date.getFullYear(), 4, '0');
  const month = pad(date.getMonth() + 1, 2, '0');
  const day = pad(date.getDate(), 2, '0');
  const hour = pad(date.getHours(), 2, '0');
  const mm = pad(date.getMinutes(), 2, '0');
  const ss = pad(date.getSeconds(), 2, '0');

  return `${year}-${month}-${day}_${hour}:${mm}:${ss}`;
};

const getHour = () => {
  const date = new Date();
  const year = pad(date.getFullYear(), 4, '0');
  const month = pad(date.getMonth() + 1, 2, '0');
  const day = pad(date.getDate(), 2, '0');
  const hour = pad(date.getHours(), 2, '0');

  return `${year}-${month}-${day}_${hour}`;
};

const getDay = () => {
  const date = new Date();
  const year = pad(date.getFullYear(), 4, '0');
  const month = pad(date.getMonth() + 1, 2, '0');
  const day = pad(date.getDate(), 2, '0');

  return `${year}-${month}-${day}`;
};

const getMonth = () => {
  const date = new Date();
  const year = pad(date.getFullYear(), 4, '0');
  const month = pad(date.getMonth() + 1, 2, '0');

  return `${year}-${month}`;
};

export {
  getTime,
  getHour,
  getDay,
  getMonth,
  timezonedTime,
};
