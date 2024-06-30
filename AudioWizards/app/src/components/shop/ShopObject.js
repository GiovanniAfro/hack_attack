import { Text, View, StyleSheet, Image } from 'react-native';

export default function ShopObject() {
  return (
    <View style={styles.container}>
    <Text style={styles.titleText}>Care</Text>
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.itemName}>Health Recovery</Text>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/kit+.png')} resizeMode="contain" />
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>50</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.itemName}>Cortisol Reduction</Text>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/cortisolpotion.png')} resizeMode="contain" />
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>500</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.itemName}>Stress Reduction</Text>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/antistress.png')} resizeMode="contain" />
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>1500</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>
      
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.itemName}>Stress Reduction</Text>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/antistress.png')} resizeMode="contain" />
        <View style={styles.itemPriceContainer}>
          <Text style={styles.value}>1500</Text>
          <Image style={styles.coinImage} source={require('../../../assets/icons/shop/coin.png')} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.itemName}>Stress Reduction</Text>
        <Image style={styles.cardImage} source={require('../../../assets/icons/shop/antistress.png')} resizeMode="contain" />
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
  itemName: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    fontSize: 15,
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
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 60,
    height: 20,
  },
  value: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 25,
  },
  coinImage: {
    width: '100%',
    height: '100%',
    maxWidth: 20,
    maxHeight: 20,
  },
});
