// @flow
import { Form } from 'component/common/form';
import Card from 'component/common/card';
import React from 'react';

type Props = {
  channel: string,
  duration: string,
  membership: { displayName: string, description: string, perks: Array<string> },
};

export default function JoinMembership(props: Props) {
  const { channel, duration, membership } = props;

  const perkDescriptions = [
    {
      perkName: 'exclusiveAccess',
      perkDescription: 'You have exclusive access to members-only content',
    },
    {
      perkName: 'earlyAccess',
      perkDescription: 'You have early access to this creators content',
    },
    {
      perkName: 'badge',
      perkDescription: 'You have a generic badge showing you are a supporter of this creator',
    },
    {
      perkName: 'emojis',
      perkDescription: 'You have access to custom members-only emojis offered by the creator',
    },
    {
      perkName: 'custom-badge',
      perkDescription: 'You can choose a custom badge showing you are an MVP supporter',
    },
  ];

  return (
    <Form style={{ maxHeight: '475px' }}>
      <Card
        title={`You have been a supporter of ${channel} for ${duration} now, I am sure they appreciate the support!`}
        className={'join-membership-modal'}
        subtitle={
          <>
            <div className="join-membership-modal-information__div">
              <h1 className="join-membership-modal-plan__header">Your tier: {membership.displayName}</h1>
              <h1 className="join-membership-modal-plan__description">{membership.description}</h1>
              <div className="join-membership-modal-perks">
                <h1 style={{ marginTop: '30px' }}>Perks:</h1>
                {membership.perks.map((tierPerk, i) => (
                  <p key={tierPerk}>
                    {perkDescriptions.map(
                      (globalPerk, i) =>
                        tierPerk === globalPerk.perkName && (
                          <ul>
                            <li className="join-membership-modal-perks__li">{globalPerk.perkDescription}</li>
                          </ul>
                        )
                    )}
                  </p>
                ))}
              </div>
            </div>
          </>
        }
      />
    </Form>
  );
}
