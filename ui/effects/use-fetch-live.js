// @flow
import React from 'react';

export default function useFetchLiveStatus(
  channelClaimId: ?string,
  doFetchChannelLiveStatus: (string) => void,
  fasterPoll?: boolean
) {
  React.useEffect(() => {
    if (channelClaimId) {
      doFetchChannelLiveStatus(channelClaimId);
    }
  }, [channelClaimId, doFetchChannelLiveStatus, fasterPoll]);
}
