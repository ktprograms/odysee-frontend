import { connect } from 'react-redux';
import { doSetContentHistoryItem, doSetPrimaryUri, clearPosition } from 'redux/actions/content';
import { withRouter } from 'react-router-dom';
import {
  selectClaimIsNsfwForUri,
  makeSelectTagInClaimOrChannelForUri,
  selectIsStreamPlaceholderForUri,
  selectClaimForUri,
} from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { makeSelectCollectionForId } from 'redux/selectors/collections';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import * as SETTINGS from 'constants/settings';
import { selectCostInfoForUri, doFetchCostInfoForUri } from 'lbryinc';
import { selectShowMatureContent, selectClientSetting } from 'redux/selectors/settings';
import {
  makeSelectFileRenderModeForUri,
  makeSelectContentPositionForUri,
  selectPlayingUri,
} from 'redux/selectors/content';
import { selectCommentsListTitleForUri, selectSettingsByChannelId } from 'redux/selectors/comments';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import { getChannelIdFromClaim } from 'util/claim';

import FilePage from './view';

const select = (state, props) => {
  const { uri } = props;
  const { search } = location;

  const urlParams = new URLSearchParams(search);
  const playingUri = selectPlayingUri(state);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID) || (playingUri && playingUri.collectionId);
  const claim = selectClaimForUri(state, uri);

  return {
    channelId: getChannelIdFromClaim(claim),
    linkedCommentId: urlParams.get('lc'),
    costInfo: selectCostInfoForUri(state, uri),
    obscureNsfw: !selectShowMatureContent(state),
    isMature: selectClaimIsNsfwForUri(state, uri),
    fileInfo: makeSelectFileInfoForUri(uri)(state),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
    contentCommentsDisabled: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_COMMENTS_TAG)(state),
    settingsByChannelId: selectSettingsByChannelId(state),
    isLivestream: selectIsStreamPlaceholderForUri(state, uri),
    hasCollectionById: Boolean(makeSelectCollectionForId(collectionId)(state)),
    collectionId,
    position: makeSelectContentPositionForUri(uri)(state),
    commentsListTitle: selectCommentsListTitleForUri(state, uri),
  };
};

const perform = {
  doFetchCostInfoForUri,
  doSetContentHistoryItem,
  doSetPrimaryUri,
  clearPosition,
};

export default withRouter(connect(select, perform)(FilePage));
