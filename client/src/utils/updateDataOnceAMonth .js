import { fetchNovaPoshtaRegions } from '../http/npAPI';

const updateDataOnceAMonth = () => {
  const currentDate = new Date();
  const lastUpdateDate = new Date(localStorage.getItem('lastUpdateNpRegions'));
  const localData = localStorage.getItem('npRegions');
  if (!localData || currentDate - lastUpdateDate > 30 * 24 * 60 * 60 * 1000) {
    const newData = fetchAndUpdateData();
    localStorage.setItem('npRegions', JSON.stringify(newData));
    localStorage.setItem('lastUpdateNpRegions', currentDate.toISOString());
  }

  const yourData = JSON.parse(localData) || [];
  return yourData;
};

const fetchAndUpdateData = () => {
  const newData = fetchNovaPoshtaRegions();
  return newData;
};

export default updateDataOnceAMonth;
