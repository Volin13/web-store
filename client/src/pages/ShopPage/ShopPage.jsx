import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Context } from '../..';
import BrandBar from '../../components/Bars/BrandBar';
import DeviceList from '../../components/Device/DeviceList';
import Pages from '../../components/UI/UX/Pages';
import TypeBar from '../../components/Bars/TypeBar';
import { fetchBrands, fetchDevices, fetchTypes } from '../../http/deviceApi';
import FilterBar from '../../components/Bars/FilterBar';

const Shop = observer(() => {
  const { device } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const contentWidth = document.documentElement.clientWidth;
  const fetchData = async () => {
    setLoading(true);
    try {
      const types = await fetchTypes();
      const brands = await fetchBrands();
      const devicesData = await fetchDevices(
        device.selectedType.id,
        device.selectedBrand.id,
        device.query,
        device.page,
        device.limit,
        device.devicesOrder
      );
      device.setTypes(types);
      device.setBrands(brands);
      device.setDevices(devicesData.rows);
      device.setTotalCount(devicesData.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    device.setSelectedBrand({});
    device.setSelectedType({});
    if (contentWidth > 1439) {
      device.setLimit(10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    device.page,
    device.selectedType,
    device.selectedBrand,
    device.query,
    device.devicesOrder,
  ]);

  return (
    <Container>
      <Row className="mt-2">
        <Col md={3} className="mb-3">
          <TypeBar loading={loading} />
          <FilterBar loading={loading} />
        </Col>
        <Col md={9}>
          <div className="d-flex flex-column">
            <BrandBar loading={loading} />
            <DeviceList loading={loading} />
            <Pages />
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
