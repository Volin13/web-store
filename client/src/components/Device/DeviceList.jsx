import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { Context } from '../..';
import DeviceItem from './DeviceItem';
import PropTypes from 'prop-types';

const DeviceList = observer(({ loading }) => {
  const { device } = useContext(Context);

  return (
    <div className=" mt-3 mb-2" style={{ flex: 1 }}>
      {/* Генеруємо 4 плейсхолдерів поки у нас завантажуються дані */}
      {loading ? (
        <ul className="d-flex flex-raw flex-wrap justify-content-around">
          {Array.from({ length: device.limit }, (_, index) => (
            <DeviceItem loading={loading} key={index}></DeviceItem>
          ))}
        </ul>
      ) : (
        <>
          {device?.devices.length > 0 ? (
            <ul className="d-flex flex-raw flex-wrap justify-content-around justify-content-sm-start">
              {device?.devices?.map((device, index) => (
                <DeviceItem
                  key={index}
                  device={device}
                  index={index}
                ></DeviceItem>
              ))}
            </ul>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center mt-3"
              style={{
                width: '100%',
                minHeight: '60vh',
              }}
            >
              {/* якщо товари в списку відсутні */}
              <h2> Товари відсутні</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
});

DeviceList.propTypes = {
  loading: PropTypes.bool,
};
export default DeviceList;
