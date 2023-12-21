import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Форматування дати

const setFormatDate = date => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
};

const styles = StyleSheet.create({
  page: {
    display: 'block',
    textAlign: 'center',

    padding: '35px 65px 135px 65px',
  },
  section: {
    display: 'flex',
    width: '80%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    textAlign: 'start',
  },
  sectionText: {
    width: '50%',
  },

  mainTitle: {
    fontSize: 40,
    fontWeight: 500,
    display: 'block',
    textAlign: 'center',
    marginBottom: '20px',
  },
  mainTable: {
    border: '1px solid #212529',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  secndaryTable: {
    display: 'flex',
    flexDirection: 'row',
  },
  brecket: {
    flex: 1,
    border: '1px solid #212529',
  },
  titleBrecket: {
    flex: 2,
    border: '1px solid #212529',
  },
  totalSection: {
    display: 'flex',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCount: {
    flex: 5,
    textAlign: 'start',
  },
  totalTitle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'end',
  },
  totalPrice: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  priceText: {
    display: 'block',
    textAlign: 'start',
    fontStyle: 'bold',
  },
  signInSection: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
  },
  signInTitle: {
    flex: 2,
  },
  signIn: {
    flex: 1,
  },
  signInUnderline: {
    textDecoration: 'underline',
    fontStyle: 'italic',
  },
});

const Invoice = ({
  order,
  convertedPrice,
  convertedPDV,
  totalPriceNumb,
  totalCount,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainTitle}>
          <Text>
            Видаткова накладна № {order.id} від{' '}
            {setFormatDate(order?.createdAt)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionText}>Постачальник:</Text>
          <Text style={styles.sectionText}>ТОВ "WebStore"</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Одержувач:</Text>
          <Text style={styles.sectionText}>
            {order?.userData.firstName} {order?.userData.lastName}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Договір:</Text>
          <Text style={styles.sectionText}>куплі-продажу від 20.12.20</Text>
        </View>

        <View style={styles.mainTable}>
          <View style={styles.secndaryTable}>
            <View style={styles.brecket}>
              <Text>№</Text>
            </View>
            <View style={styles.titleBrecket}>
              <Text>Товар</Text>
            </View>
            <View style={styles.brecket}>
              <Text>К-сть</Text>
            </View>
            <View style={styles.brecket}>
              <Text>Ціна без ПДВ</Text>
            </View>
            <View style={styles.brecket}>
              <Text>Сума без ПДВ</Text>
            </View>
          </View>

          {order?.orderList.map((item, index) => (
            <View key={index} style={styles.secndaryTable}>
              <View style={styles.brecket}>
                <Text>{index + 1}</Text>
              </View>
              <View style={styles.titleBrecket}>
                <Text>{item.title}</Text>
              </View>
              <View style={styles.brecket}>
                <Text>{item.count}</Text>
              </View>
              <View style={styles.brecket}>
                <Text>{Number(item.price) * 0.8}</Text>
              </View>
              <View style={styles.brecket}>
                <Text>{Number(item.count) * (Number(item.price) * 0.8)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalCount}>
            <Text>Всього найменувать: {totalCount.current} шт</Text>
          </View>

          <View style={styles.totalTitle}>
            <Text>Всього:</Text>
            <Text>Сума ПДВ</Text>
            <Text>Сума з ПДВ</Text>
          </View>

          <View style={styles.totalPrice}>
            <Text>{totalPriceNumb * 0.8}</Text>
            <Text>{totalPriceNumb * 0.2}</Text>
            <Text>{order.userData?.total}</Text>
          </View>
        </View>

        <Text style={styles.priceText}>До сплати: {convertedPrice},</Text>
        <Text style={styles.priceText}>У т.ч. ПДВ:{convertedPDV}</Text>

        <View style={styles.signInSection}>
          <Text style={styles.signInTitle}>Від постачальника:</Text>
          <Text style={styles.signInUnderline}>Кухаришин</Text>
          <Text style={styles.signIn}>Кухаришин О.</Text>
          <Text style={styles.signIn}>Отримав(ла)</Text>
          <Text style={styles.signInUnderline}>
            {order?.userData?.lastName}
          </Text>
          <Text style={styles.signIn}>
            {order?.userData?.lastName} {order?.userData?.firstName.charAt(0)}.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
