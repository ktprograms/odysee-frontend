// @flow
import { MATURE_TAGS } from 'constants/tags';
import { parseURI } from 'util/lbryURI';

const matureTagMap = MATURE_TAGS.reduce((acc, tag) => ({ ...acc, [tag]: true }), {});

export const isClaimNsfw = (claim: Claim): boolean => {
  if (!claim) {
    throw new Error('No claim passed to isClaimNsfw()');
  }

  if (!claim.value) {
    return false;
  }

  const tags = claim.value.tags || [];
  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i].toLowerCase();
    if (matureTagMap[tag]) {
      return true;
    }
  }

  return false;
};

export function createNormalizedClaimSearchKey(options: { page: number, release_time?: string }) {
  // Ignore page because we don't care what the last page searched was, we want everything
  // Ignore release_time because that will change depending on when you call claim_search ex: release_time: ">12344567"
  const { page: optionToIgnoreForQuery, release_time: anotherToIgnore, ...rest } = options;
  const query = JSON.stringify(rest);
  return query;
}

export function concatClaims(claimList: Array<Claim> = [], concatClaimList: Array<any> = []): Array<Claim> {
  if (!claimList || claimList.length === 0) {
    if (!concatClaimList) {
      return [];
    }
    return concatClaimList.slice();
  }

  const claims = claimList.slice();
  concatClaimList.forEach((claim) => {
    if (!claims.some((item) => item.claim_id === claim.claim_id)) {
      claims.push(claim);
    }
  });

  return claims;
}

export function filterClaims(claims: Array<Claim>, query: ?string): Array<Claim> {
  if (query) {
    const queryMatchRegExp = new RegExp(query, 'i');
    return claims.filter((claim) => {
      const { value } = claim;

      return (
        (value.title && value.title.match(queryMatchRegExp)) ||
        (claim.signing_channel && claim.signing_channel.name.match(queryMatchRegExp)) ||
        (claim.name && claim.name.match(queryMatchRegExp))
      );
    });
  }

  return claims;
}

/**
 * Determines if the claim is a channel.
 *
 * @param claim
 * @param uri An abandoned claim will be null, so provide the `uri` as a fallback to parse.
 */
export function isChannelClaim(claim: ?Claim, uri?: string) {
  // 1. parseURI can't resolve a repost's channel, so a `claim` will be needed.
  // 2. parseURI is still needed to cover the case of abandoned claims.
  if (claim) {
    return claim.value_type === 'channel';
  } else if (uri) {
    try {
      return Boolean(parseURI(uri).isChannel);
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
}

export function isCanonicalUrl(uri: string) {
  let streamName, streamClaimId, channelName, channelClaimId;
  try {
    ({ streamName, streamClaimId, channelName, channelClaimId } = parseURI(uri));
  } catch (error) {}

  return Boolean(streamName && streamClaimId && channelName && channelClaimId);
}

export function isPermanentUrl(uri: string) {
  let streamName, streamClaimId, channelName;
  try {
    ({ streamName, streamClaimId, channelName } = parseURI(uri));
  } catch (error) {}

  return Boolean(streamName && streamClaimId && !channelName);
}

export function getChannelIdFromClaim(claim: ?Claim) {
  if (claim) {
    if (claim.value_type === 'channel') {
      return claim.claim_id;
    } else if (claim.signing_channel) {
      return claim.signing_channel.claim_id;
    }
  }
}

export const getNameFromClaim = (claim: ?Claim) => claim && claim.name;

export function getChannelNameFromClaim(claim: ?Claim) {
  const channelFromClaim = getChannelFromClaim(claim);
  return getNameFromClaim(channelFromClaim);
}

export function getChannelTitleFromClaim(claim: ?Claim) {
  const channelFromClaim = getChannelFromClaim(claim);
  const value = getClaimMetadata(channelFromClaim);
  return value && value.title;
}

export function getChannelFromClaim(claim: ?Claim) {
  return !claim
    ? null
    : claim.value_type === 'channel'
    ? claim
    : claim.signing_channel && claim.is_channel_signature_valid
    ? claim.signing_channel
    : null;
}

export function getClaimMetadata(claim: ?Claim) {
  const metadata = claim && claim.value;
  return metadata || (claim === undefined ? undefined : null);
}

export function getClaimTitle(claim: ?Claim) {
  const metadata = getClaimMetadata(claim);
  return metadata && metadata.title;
}

export function getClaimVideoInfo(claim: ?Claim) {
  const metadata = getClaimMetadata(claim);
  // $FlowFixMe
  return metadata && metadata.video;
}

export function getVideoClaimAspectRatio(claim: ?Claim) {
  const { width: claimWidth, height: claimHeight } = getClaimVideoInfo(claim) || {};

  // some might not have these values, so default to 16:9
  const width = claimWidth || 1920;
  const height = claimHeight || 1080;

  return height / width;
}

export const isStreamPlaceholderClaim = (claim: ?StreamClaim) => {
  return claim ? Boolean(claim.value_type === 'stream' && !claim.value.source) : false;
};

export const getThumbnailFromClaim = (claim: ?Claim) => {
  const thumbnail = claim && claim.value && claim.value.thumbnail;
  return thumbnail && thumbnail.url ? thumbnail.url.trim().replace(/^http:\/\//i, 'https://') : undefined;
};

export const getClaimMeta = (claim: ?Claim) => claim && claim.meta;
export const getClaimRepostedAmount = (claim: ?Claim) => getClaimMeta(claim)?.reposted;
