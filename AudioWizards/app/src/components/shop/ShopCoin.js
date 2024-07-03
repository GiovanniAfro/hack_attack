import { Text, View, StyleSheet, Image } from 'react-native';

export default function ShopCoin() {
  return (
    <View style={styles.container}>
    <Text style={styles.titleText}>Coins</Text>
      <View style={[styles.card, styles.shadowProp]}>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/coin.png')} />
        <Text style={styles.priceText}>0.99$</Text>
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>50</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/coin2.png')} />
        <Text style={styles.priceText}>5.99$</Text>
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>500</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/coin3.png')} />
        <Text style={styles.priceText}>10.99$</Text>
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>1500</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    rowGap: 20,
    paddingBottom: 10,
    paddingTop: 50,
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
  },
  titleText: {
    position: 'absolute',
    top: 5,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 25,
    zIndex: 5,
  },
  card: {
    position: 'relative',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    gap: 3,
    alignItems: 'center',
    width: 100,
    height: 150,
    backgroundColor: 'white',
  },
  cardImage: {
    top: 20,
    width: 80,
    height: 80,
    backgroundColor: 'white',
  },
  shadowProp: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemPriceContainer: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    width: 60,
    height: 20,
    backgroundColor: 'green',
  },
  value: {
    color: 'white',
    fontWeight: 'bold',
  },
  coinImage: {
    width: '100%',
    height: '100%',
    maxWidth: 20,
    maxHeight: 20,
  },
  priceText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 25,
  },
});
