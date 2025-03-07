// @flow
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import classnames from 'classnames';
import * as REACTION_TYPES from 'constants/reactions';
import * as ICONS from 'constants/icons';
import RatioBar from 'component/ratioBar';
import { formatNumberWithCommas } from 'util/number';
import FileActionButton from 'component/common/file-action-button';

const LIVE_REACTION_FETCH_MS = 1000 * 45;

type Props = {
  uri: string,
  // redux
  claimId?: string,
  likeCount: number,
  dislikeCount: number,
  myReaction: ?string,
  isLivestreamClaim?: boolean,
  doFetchReactions: (claimId: ?string) => void,
  doReactionLike: (uri: string) => void,
  doReactionDislike: (uri: string) => void,
};

export default function FileReactions(props: Props) {
  const {
    uri,
    claimId,
    myReaction,
    likeCount,
    dislikeCount,
    isLivestreamClaim,
    doFetchReactions,
    doReactionLike,
    doReactionDislike,
  } = props;

  React.useEffect(() => {
    function fetchReactions() {
      doFetchReactions(claimId);
    }

    let fetchInterval;
    if (claimId) {
      fetchReactions();

      if (isLivestreamClaim) {
        fetchInterval = setInterval(fetchReactions, LIVE_REACTION_FETCH_MS);
      }
    }

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [claimId, doFetchReactions, isLivestreamClaim]);

  return (
    <div className="ratio-wrapper">
      <LikeButton myReaction={myReaction} reactionCount={likeCount} onClick={() => doReactionLike(uri)} />
      <DislikeButton myReaction={myReaction} reactionCount={dislikeCount} onClick={() => doReactionDislike(uri)} />
      <RatioBar likeCount={likeCount} dislikeCount={dislikeCount} />
    </div>
  );
}

const Placeholder = <Skeleton variant="text" animation="wave" className="reaction-count-placeholder" />;

type ButtonProps = {
  myReaction: ?string,
  reactionCount: number,
  onClick: () => void,
};

const LikeButton = (props: ButtonProps) => {
  const { myReaction, reactionCount, onClick } = props;

  return (
    <FileActionButton
      title={__('I like this')}
      requiresAuth
      authSrc="filereaction_like"
      className={classnames('button--file-action button-like', {
        'button--fire': myReaction === REACTION_TYPES.LIKE,
      })}
      label={
        <>
          {myReaction === REACTION_TYPES.LIKE && (
            <>
              <div className="button__fire-glow" />
              <div className="button__fire-particle1" />
              <div className="button__fire-particle2" />
              <div className="button__fire-particle3" />
              <div className="button__fire-particle4" />
              <div className="button__fire-particle5" />
              <div className="button__fire-particle6" />
            </>
          )}
          {Number.isInteger(reactionCount) ? <span>{formatNumberWithCommas(reactionCount, 0)}</span> : Placeholder}
        </>
      }
      iconSize={18}
      icon={myReaction === REACTION_TYPES.LIKE ? ICONS.FIRE_ACTIVE : ICONS.FIRE}
      onClick={onClick}
    />
  );
};

const DislikeButton = (props: ButtonProps) => {
  const { myReaction, reactionCount, onClick } = props;

  return (
    <FileActionButton
      requiresAuth
      authSrc={'filereaction_dislike'}
      title={__('I dislike this')}
      className={classnames('button--file-action button-dislike', {
        'button--slime': myReaction === REACTION_TYPES.DISLIKE,
      })}
      label={
        <>
          {myReaction === REACTION_TYPES.DISLIKE && (
            <>
              <div className="button__slime-stain" />
              <div className="button__slime-drop1" />
              <div className="button__slime-drop2" />
            </>
          )}
          {Number.isInteger(reactionCount) ? <span>{formatNumberWithCommas(reactionCount, 0)}</span> : Placeholder}
        </>
      }
      iconSize={18}
      icon={myReaction === REACTION_TYPES.DISLIKE ? ICONS.SLIME_ACTIVE : ICONS.SLIME}
      onClick={onClick}
    />
  );
};
