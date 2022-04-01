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

type Props = {

};


export default function JoinMembership(props: Props) {
  const {} = props;

  let membershipTiers = [{
    displayName: 'Helping Hand',
    description: 'You\'re doing your part, thank you!',
    monthlyContributionInUSD: 5,
    perks: ['exclusiveAccess', 'badge'],
  }, {
    displayName: 'Big-Time Supporter',
    description: 'You are a true fan and are helping in a big way!',
    monthlyContributionInUSD: 10,
    perks: ['exclusiveAccess', 'earlyAccess', 'badge', 'emojis'],
  }, {
    displayName: 'Community MVP',
    description: 'Where would this creator be without you? You are a true legend!',
    monthlyContributionInUSD: 20,
    perks: ['exclusiveAccess', 'earlyAccess', 'badge', 'emojis', 'custom-badge'],
  }];

  const perkDescriptions = [{
    perkName: 'exclusiveAccess',
    perkDescription: 'You will exclusive access to members-only content',
  }, {
    perkName: 'earlyAccess',
    perkDescription: 'You will get early access to this creators content',
  }, {
    perkName: 'badge',
    perkDescription: 'You will get a generic badge showing you are a supporter of this creator',
  }, {
    perkName: 'emojis',
    perkDescription: 'You will get access to custom members-only emojis offered by the creator',
  }, {
    perkName: 'custom-badge',
    perkDescription: 'You can choose a custom badge showing you are an MVP supporter',
  }];

  const [isOnConfirmationPage, setConfirmationPage] = React.useState(false);

  const [membershipIndex, setMembershipIndex] = React.useState(0);

  const [activeTab, setActiveTab] = React.useState('Tier1');

  const tabButtonProps = { isOnConfirmationPage, activeTab, setActiveTab, setMembershipIndex };

  return (
    <Form >
      {/* if there is no LBC balance, show user frontend to get credits */}
      {/* if there is lbc, the main tip/boost gui with the 3 tabs at the top */}
      <Card
        title="Join Creator Membership"
        className={'join-membership-modal'}
        subtitle={
          <>
            <h1 className="join-membership-modal__subheader">Join this creator's channel for access</h1>
            <h1 className="join-membership-modal__subheader" style={{ marginBottom: '14px' }}>to exclusive content and perks</h1>
            <div className="section">
              {membershipTiers.map((membershipTier, index) => (
                <>
                  {/* change tier button */}
                  <TabSwitchButton index={index} label={__('Tier ' + (index + 1))} name={`Tier${index + 1}`} {...tabButtonProps} />
                </>
              ))}
            </div>
            <div className="join-membership-modal-information__div">
              <h1 className="join-membership-modal-plan__header">{membershipTiers[membershipIndex].displayName}</h1>
              <h1 className="join-membership-modal-plan__description">{membershipTiers[membershipIndex].description}</h1>
              <div className="join-membership-modal-perks" >
                <h1 style={{ marginTop: '30px' }}>Perks:</h1>
                {membershipTiers[membershipIndex].perks.map((tierPerk, i) => (
                  <>
                    <p>
                      {/* list all the perks */}
                      {perkDescriptions.map((globalPerk, i) => (
                        <>
                          {tierPerk === globalPerk.perkName && (
                            <>
                              <ul>
                                <li className="join-membership-modal-perks__li">
                                  {globalPerk.perkDescription}
                                </li>
                              </ul>
                            </>
                          )}
                        </>
                      ))}
                    </p>
                  </>
                ))}
              </div>
              <Button
                className="join-membership-modal-purchase__button"
                autoFocus
                icon={ICONS.UPGRADE}
                button="primary"
                type="submit"
                disabled={false}
                label={`Signup for $${membershipTiers[membershipIndex].monthlyContributionInUSD} a month`}
              />
            </div>
          </>
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
  index: number,
  setMembershipIndex: (number) => void,
};

const TabSwitchButton = (tabButtonProps: TabButtonProps) => {
  const { icon, label, name, isOnConfirmationPage, activeTab, setActiveTab, index, setMembershipIndex } = tabButtonProps;

  return (
    <Button
      key={name}
      icon={icon}
      label={label}
      button="alt"
      onClick={() => {
        const tipInputElement = document.getElementById('tip-input');
        if (tipInputElement) tipInputElement.focus();
        if (!isOnConfirmationPage) {
          setActiveTab(name);
          setMembershipIndex(index);
        }
      }}
      className={classnames('button-toggle', { 'button-toggle--active': activeTab === name })}
    />
  );
};
