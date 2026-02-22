import React from 'react';
import { Slot } from '@openedx/frontend-base';
import RelatedLinks from '../course-home/progress-tab/related-links/RelatedLinks';

const ProgressTabRelatedLinksSlot = () => (
  <Slot
    id="org.openedx.frontend.slot.learning.progressTabRelatedLinks.v1"
  >
    <RelatedLinks />
  </Slot>
);

export default ProgressTabRelatedLinksSlot;
