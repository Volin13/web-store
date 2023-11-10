import { fetchNovaPoshtaRegions } from '../http/npAPI';

const updateDataOnceAMonth = () => {
  const currentDate = new Date();
  const lastUpdateDate = new Date(localStorage.getItem('lastUpdateNpRegions'));

  if (
    !localStorage.getItem('npRegions') ||
    currentDate - lastUpdateDate > 30 * 24 * 60 * 60 * 1000
  ) {
    const newData = fetchAndUpdateData();
    localStorage.setItem('npRegions', JSON.stringify(newData));
    localStorage.setItem('lastUpdateNpRegions', currentDate.toISOString());
  }

  const yourData = JSON.parse(localStorage.getItem('npRegions')) || [];
  return yourData;
};

const fetchAndUpdateData = () => {
  const newData = fetchNovaPoshtaRegions('');
  return newData;
};

export default updateDataOnceAMonth;
