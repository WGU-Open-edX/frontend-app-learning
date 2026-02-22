import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  srPrices: {
    id: 'learning.offer.screenReaderPrices', // historic id
    defaultMessage: 'Original price: {originalPrice}, discount price: {discountedPrice}',
  },
  srInlinePrices: {
    id: 'learning.upgradeButton.screenReaderInlinePrices',
    defaultMessage: 'Original price: {originalPrice}',
  },
});

export default messages;
