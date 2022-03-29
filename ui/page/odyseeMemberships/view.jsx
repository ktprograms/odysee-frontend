/* eslint-disable no-console */
// @flow
import React from 'react';
import Page from 'component/page';
import { getStripeEnvironment } from 'util/stripe';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import { useHistory } from 'react-router';
import * as PAGES from 'constants/pages';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FormField } from 'component/common/form';

let stripeEnvironment = getStripeEnvironment();

const TAB_QUERY = 'tab';

const TABS = {
  CREATE_TIERS: 'tiers',
  PAYOUT: 'payout',
  BALANCE: 'balance',
};

const isDev = process.env.NODE_ENV !== 'production';

let log = (input) => {};
if (isDev) log = console.log;

type Props = {

};

const MembershipsPage = (props: Props) => {

  const {

  } = props;

  const {
    location: { search },
    push,
  } = useHistory();

  const urlParams = new URLSearchParams(search);

  // if tiers are saved, then go to balance, otherwise go to tiers
  const currentView = urlParams.get(TAB_QUERY) || TABS.CREATE_TIERS;

  let tabIndex;
  switch (currentView) {
    case TABS.CREATE_TIERS:
      tabIndex = 0;
      break;
    case TABS.PAYOUT:
      tabIndex = 1;
      break;
    case TABS.BALANCE:
      tabIndex = 2;
      break;
    default:
      tabIndex = 0;
      break;
  }

  function onTabChange(newTabIndex) {
    let url = `/$/${PAGES.CREATOR_MEMBERSHIPS}?`;

    if (newTabIndex === 0) {
      url += `${TAB_QUERY}=${TABS.CREATE_TIERS}`;
    } else if (newTabIndex === 1) {
      url += `${TAB_QUERY}=${TABS.PAYOUT}`;
    } else if (newTabIndex === 2) {
      url += `${TAB_QUERY}=${TABS.BALANCE}`;
    }
    push(url);
  }

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

  const [isEditing, setIsEditing] = React.useState(false);

  const [creatorMemberships, setCreatorMemberships] = React.useState(membershipTiers);

  const [editTierDescription, setEditTierDescription] = React.useState('');

  const editMembership = function (e, tierIndex, tierDescription) {

    log(tierIndex)
    setEditTierDescription(tierDescription);
    setIsEditing(tierIndex);
  };

  const deleteMembership = function (tierIndex) {
    log(tierIndex)

    let membershipsBeforeDeletion = creatorMemberships;

    log(membershipsBeforeDeletion)

    membershipsBeforeDeletion.splice(tierIndex, 1);

    log(membershipsBeforeDeletion)

    setCreatorMemberships(membershipsBeforeDeletion)
  };

  const addMembership = function () {
    const newMembership = {
      displayName: 'New Membership Tier',
      description: 'Here\'s your 4th added tier. You can add one more.',
      monthlyContributionInUSD: 5,
      perks: ['exclusiveAccess', 'badge'],
    };

    console.log(creatorMemberships);

    const newFirjoa = creatorMemberships.push(newMembership);
    log(newFirjoa);

    // setCreatorMemberships(creatorMemberships.push(newMembership));


  };

  const handleChange = (event) => {
    setEditTierDescription(event.target.value);
  };

  const cancelEditingMembership =  function () {
    setIsEditing(false);
  };

  function saveMembership(tierIndex) {

    log(tierIndex)
    console.log(creatorMemberships);

    const matchingMembershipByIndex = creatorMemberships[tierIndex];

    const copyOfMemberships = creatorMemberships;

    log(matchingMembershipByIndex);

    const newTierName = document.querySelectorAll('input[name=tier_name]')[0]?.value;
    const newTierDescription = editTierDescription;
    const newTierMonthlyContribution = document.querySelectorAll('input[name=tier_contribution]')[0]?.value;

    const newObject = {
      displayName: newTierName,
      description: newTierDescription,
      monthlyContributionInUSD: newTierMonthlyContribution,
      perks: ['exclusiveAccess', 'earlyAccess', 'badge', 'emojis', 'custom-badge'],
    };

    console.log(newObject);

    copyOfMemberships[tierIndex] = newObject;

    log(copyOfMemberships);

    setCreatorMemberships(copyOfMemberships);

    setIsEditing(false);
  }

  function createEditTier(tier, membershipIndex) {
    return (
      <div className="edit-div" style={{ marginBottom: '45px' }}>
        <FormField
          type="text"
          name="tier_name"
          label={__('Tier Name')}
          defaultValue={tier.displayName}
        />
        {/* could be cool to have markdown */}
        {/*<FormField*/}
        {/*  type="markdown"*/}
        {/*  name="tier_description"*/}
        {/*  label={__('Tier Description')}*/}
        {/*  placeholder={__('Description of your tier')}*/}
        {/*  value={tier.description}*/}
        {/*/>*/}
        <FormField
          type="textarea"
          rows="10"
          name="tier_description"
          label={__('Tier Description')}
          placeholder={__('Description of your tier')}
          value={editTierDescription}
          onChange={handleChange}
        />
        <FormField
          className="form-field--price-amount"
          type="number"
          name="tier_contribution"
          step="1"
          label={__('Monthly Contribution ($/Month)')}
          defaultValue={tier.monthlyContributionInUSD}
          onChange={(event) => parseFloat(event.target.value)}
        />
        <div className="section__actions">
          <Button button="primary" label={'Save Tier'} onClick={() => saveMembership(membershipIndex)} />
          <Button button="link" label={__('Cancel')} onClick={cancelEditingMembership} />
        </div>
      </div>
    );
  }

  const createTiers = (
    <div className="create-tiers-div">

      <div className="memberships-header" style={{ marginBottom: 'var(--spacing-xl)'}}>
        <h1 style={{ fontSize: '24px', marginBottom: 'var(--spacing-s)' }}>Create Your Membership Tiers</h1>
        <h2 style={{ fontSize: '18px' }}>Here you will be able to define the tiers that your viewers can subscribe to</h2>
      </div>

      {/* list through different tiers */}
      {creatorMemberships.map((membershipTier, membershipIndex) => (
        <>
          {isEditing === membershipIndex && (
            <>
              {createEditTier(membershipTier, membershipIndex)}
            </>
          )}
          {isEditing !== membershipIndex && (
            <div style={{ marginBottom: 'var(--spacing-xxl)'}}>
              <div style={{ marginBottom: 'var(--spacing-s)'}}>Tier Name: {membershipTier.displayName}</div>
              <h1 style={{ marginBottom: 'var(--spacing-s)'}}>{membershipTier.description}</h1>
              <h1 style={{ marginBottom: 'var(--spacing-s)'}}>Monthly Pledge: ${membershipTier.monthlyContributionInUSD}</h1>
              {membershipTier.perks.map((tierPerk, i) => (
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
                onClick={(e) => editMembership(e, membershipIndex, membershipTier.description)}
                className="edit-membership-button"
                label={__('Edit Tier')}
                icon={ICONS.EDIT}
              />
              {/* cancel membership button */}
              <Button
                button="alt"
                onClick={(e) => deleteMembership(membershipIndex)}
                className="cancel-membership-button"
                label={__('Delete Tier')}
                icon={ICONS.DELETE}
              />
            </div>
          )}
        </>
      ))}

      <Button
        button="alt"
        onClick={(e) => addMembership()}
        className="add-membership-button"
        label={__('Add Tier')}
        icon={ICONS.ADD}
      />
    </div>
  );

  return (
    <>
      <Page className="premium-wrapper">
        <Tabs onChange={onTabChange} index={tabIndex}>
          <TabList className="tabs__list--collection-edit-page">
            <Tab>{__('Create Tiers')}</Tab>
            <Tab>{__('Payout Options')}</Tab>
            <Tab>{__('Supporters')}</Tab>
          </TabList>
          <TabPanels>
            {/* balances for lbc and fiat */}
            <TabPanel>
              {createTiers}
            </TabPanel>
            {/* transactions panel */}
            <TabPanel>
              <h1>Payout Options</h1>
            </TabPanel>
            <TabPanel>
              <h1>Supporters</h1>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Page>
    </>
  );
};

export default MembershipsPage;
