/* eslint-disable no-console */
// @flow
import React from 'react';
import Page from 'component/page';
import { getStripeEnvironment } from 'util/stripe';
import * as ICONS from 'constants/icons';
import Button from 'component/button';

let stripeEnvironment = getStripeEnvironment();

const isDev = process.env.NODE_ENV !== 'production';

let log = (input) => {};
if (isDev) log = console.log;

type Props = {

};

const MembershipsPage = (props: Props) => {
  const {

  } = props;

  const defaultTiers = [{
    name: 'helping-hand',
    displayName: 'Helping Hand',
    description: 'You\'re doing your part, thank you!',
    monthlyContributionInUSD: 5,
    perks: ['exclusiveAccess', 'badge'],
  }, {
    name: 'big-time-supporter',
    displayName: 'Big-Time Supporter',
    description: 'You are a true fan and are helping in a big way!',
    monthlyContributionInUSD: 10,
    perks: ['exclusiveAccess', 'earlyAccess', 'badge', 'emojis'],
  }, {
    name: 'community-mvp',
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

  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <>
      <Page className="premium-wrapper">
        <div className="memberships-header" style={{ marginBottom: 'var(--spacing-xl)'}}>
          <h1 style={{ fontSize: '24px', marginBottom: 'var(--spacing-s)' }}>Create Your Membership Tiers</h1>
          <h2 style={{ fontSize: '18px' }}>Here you will be able to define the tiers that your viewers can subscribe to</h2>
        </div>

        {defaultTiers.map((tier, i) => (
          <>
            <div style={{ marginBottom: 'var(--spacing-xxl)'}}>
              <div style={{ marginBottom: 'var(--spacing-s)'}}>Tier Name: {tier.displayName}</div>
              <h1 style={{ marginBottom: 'var(--spacing-s)'}}>{tier.description}</h1>
              <h1 style={{ marginBottom: 'var(--spacing-s)'}}>Monthly Pledge: ${tier.monthlyContributionInUSD}</h1>
              {tier.perks.map((tierPerk, i) => (
                <>
                  <p>
                    {perkDescriptions.map((globalPerk, i) => (
                      <>
                        {tierPerk === globalPerk.perkName && (
                          <>
                            <ul>
                              <li>
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
              {/* cancel membership button */}
              <Button
                button="alt"
                // onClick={(e) => cancelMembership(e, membership)}
                className="cancel-membership-button"
                label={__('Edit Tier')}
                icon={ICONS.EDIT}
              />
              {/* cancel membership button */}
              <Button
                button="alt"
                // onClick={(e) => cancelMembership(e, membership)}
                className="cancel-membership-button"
                label={__('Delete Tier')}
                icon={ICONS.DELETE}
              />
            </div>
          </>
        ))}
        <Button
          button="alt"
          // onClick={(e) => cancelMembership(e, membership)}
          className="cancel-membership-button"
          label={__('Delete Tier')}
          icon={ICONS.DELETE}
        />

      </Page>
    </>
  );
};

export default MembershipsPage;
