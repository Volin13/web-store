import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Image, ListGroup, Placeholder } from 'react-bootstrap';
import { Context } from '../..';
import showMoreIcon from '../../assets/defultIcons/down-arrow-arrows-svgrepo-com.svg';
import hideMoreIcon from '../../assets/defultIcons/up-arrow-arrows-svgrepo-com.svg';

const TypeBar = observer(({ loading }) => {
  const { device } = useContext(Context);
  const [showBar, setShowBar] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [selectedType, setSelectedType] = useState(false);

  const handleTypeBarClick = Type => {
    if (!selectedType) {
      setSelectedType(true);
      device.setSelectedType(Type);
      device.setSelectedBrand({});
    } else {
      setSelectedType(false);
      device.setSelectedType({});
    }
  };

  return (
    <div
      onMouseEnter={() => {
        setShowBtn(true);
      }}
      onMouseLeave={() => {
        setShowBtn(false);
      }}
    >
      <ListGroup
        style={{
          position: 'sticky',
          maxHeight: showBar ? '80vh' : '141px',
          borderBottom: '1px solid #e6e9ec',
          overflow: 'auto',
        }}
      >
        {loading ? (
          <>
            {Array.from({ length: 4 }, (_, index) => (
              <ListGroup.Item className="text-center text-sm-start">
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </ListGroup.Item>
            ))}
          </>
        ) : (
          <>
            {device?.types?.map(type => (
              <ListGroup.Item
                className="text-center text-sm-start"
                style={{ cursor: 'pointer' }}
                active={type.id === device.selectedType.id}
                key={type.id}
                onClick={() => {
                  handleTypeBarClick(type);
                }}
                action
              >
                {type.name}
              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
      {showBtn && (
        <button
          type="button"
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '100%',
            border: '1px solid #e6e9ec',
            borderRadius: '6px',
          }}
          onClick={() => {
            setShowBar(!showBar);
          }}
        >
          {!showBar ? (
            <Image width={30} height={30} src={showMoreIcon} />
          ) : (
            <Image width={30} height={30} src={hideMoreIcon} />
          )}
        </button>
      )}
    </div>
  );
});

export default TypeBar;
