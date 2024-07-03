import React from 'react';

import { ShopContainer } from './shop.styles';

import ShopCoin from '@components/shop/ShopCoin';
import ShopObject from '@components/shop/ShopObject';

const Shop = () => {
  return (
    <ShopContainer>
      <ShopCoin />
      <ShopObject />
    </ShopContainer>
  );
};

export default Shop;
