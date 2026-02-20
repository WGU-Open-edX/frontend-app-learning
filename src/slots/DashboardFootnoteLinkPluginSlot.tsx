import React from 'react';
import { Slot, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Hyperlink } from '@openedx/paragon';
import messages from '../courseware/course/course-exit/messages';

interface Props {
  destination: string;
}

const DashboardFootnoteLink: React.FC<Props> = ({ destination }: Props) => {
  const intl = useIntl();
  return (
    <p className="small">
      {intl.formatMessage(messages.dashboardFootnoteLink, {
        linkStart: <Hyperlink destination={destination}>,
        linkEnd: </Hyperlink>,
      })}
    </p>
  );
};

export const DashboardFootnoteLinkPluginSlot: React.FC = () => {
  const destination = `${getSiteConfig().lmsBaseUrl}/dashboard`;
  return (
    <Slot
      id="org.openedx.frontend.slot.learning.dashboardFootnoteLink.v1"
    >
      <DashboardFootnoteLink destination={destination} />
    </Slot>
  );
};

export default DashboardFootnoteLinkPluginSlot;
