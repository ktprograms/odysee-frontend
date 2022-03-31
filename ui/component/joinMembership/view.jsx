// @flow
import { Form } from 'component/common/form';
import { Lbryio } from 'lbryinc';
import { parseURI } from 'util/lbryURI';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import Card from 'component/common/card';
import ChannelSelector from 'component/channelSelector';
import classnames from 'classnames';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import WalletTipAmountSelector from 'component/walletTipAmountSelector';

import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

const TAB_BOOST = 'TabBoost';
const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type SupportParams = { amount: number, claim_id: string, channel_id?: string };
type TipParams = { tipAmount: number, tipChannelName: string, channelClaimId: string };
type UserParams = { activeChannelName: ?string, activeChannelId: ?string };

type Props = {
  activeChannelId?: string,
  activeChannelName?: string,
  balance: number,
  claimId?: string,
  claimType?: string,
  channelClaimId?: string,
  tipChannelName?: string,
  claimIsMine: boolean,
  fetchingChannels: boolean,
  incognito: boolean,
  instantTipEnabled: boolean,
  instantTipMax: { amount: number, currency: string },
  isPending: boolean,
  isSupport: boolean,
  title: string,
  uri: string,
  isTipOnly?: boolean,
  hasSelectedTab?: string,
  customText?: string,
  doHideModal: () => void,
  doSendCashTip: (
    TipParams,
    anonymous: boolean,
    UserParams,
    claimId: string,
    stripe: ?string,
    preferredCurrency: string,
    ?(any) => void
  ) => string,
  doSendTip: (SupportParams, boolean) => void, // function that comes from lbry-redux
  setAmount?: (number) => void,
  preferredCurrency: string,
};

export default function JoinMembership(props: Props) {
  const {} = props;

  return (
    <Form >
      {/* if there is no LBC balance, show user frontend to get credits */}
      {/* if there is lbc, the main tip/boost gui with the 3 tabs at the top */}
      <Card
        title="Join Creator Membership"
        className={'join-membership-modal'}
        subtitle={
          <>
            <div className="section">
              {/* tip fiat tab button */}
              <TabSwitchButton label={__('Tier 1')} name={TAB_FIAT} />

              {/* tip LBC tab button */}
              <TabSwitchButton label={__('Tier 2')} name={TAB_LBC} />

              {/* support LBC tab button */}
              <TabSwitchButton label={__('Tier 3')} name={TAB_BOOST} />

              <TabSwitchButton label={__('Tier 4')} name={TAB_BOOST} />

              <TabSwitchButton label={__('Tier 5')} name={TAB_BOOST} />
            </div>
          </>
        }
        actions={
          // if it's LBC and there is no balance, you can prompt to purchase LBC
          <Card
            title={
              <h1>Hello</h1>
            }
            subtitle={
              <h1>Hello</h1>
            }
            actions={
              <h1>Hello</h1>
            }
          />
        }
      />
    </Form>
  );
}

type TabButtonProps = {
  icon: string,
  label: string,
  name: string,
  isOnConfirmationPage: boolean,
  activeTab: string,
  setActiveTab: (string) => void,
};

const TabSwitchButton = (tabButtonProps: TabButtonProps) => {
  const { icon, label, name, isOnConfirmationPage, activeTab, setActiveTab } = tabButtonProps;
  return (
    <Button
      key={name}
      icon={icon}
      label={label}
      button="alt"
      onClick={() => {
        const tipInputElement = document.getElementById('tip-input');
        if (tipInputElement) tipInputElement.focus();
        if (!isOnConfirmationPage) setActiveTab(name);
      }}
      className={classnames('button-toggle', { 'button-toggle--active': activeTab === name })}
    />
  );
};
