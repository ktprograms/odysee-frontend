import { connect } from 'react-redux';
import { doResetThumbnailStatus, doClearPublish, doUpdatePublishForm, doPublishDesktop } from 'redux/actions/publish';
import { doResolveUri, doCheckPublishNameAvailability } from 'redux/actions/claims';
import {
  selectPublishFormValues,
  selectIsStillEditing,
  selectPublishFormValue,
  selectMyClaimForUri,
} from 'redux/selectors/publish';
import { selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as SETTINGS from 'constants/settings';
import { doClaimInitialRewards } from 'redux/actions/rewards';
import {
  selectUnclaimedRewardValue,
  selectIsClaimingInitialRewards,
  selectHasClaimedInitialRewards,
} from 'redux/selectors/rewards';
import { selectModal, selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { selectUser } from 'redux/selectors/user';
import { selectBalance } from 'redux/selectors/wallet';
import LivestreamForm from './view';

const select = (state) => {
  const myClaimForUri = selectMyClaimForUri(state);
  const permanentUrl = (myClaimForUri && myClaimForUri.permanent_url) || '';
  const isPostClaim = makeSelectFileRenderModeForUri(permanentUrl)(state) === RENDER_MODES.MARKDOWN;

  return {
    ...selectPublishFormValues(state),
    user: selectUser(state),
    // The winning claim for a short lbry uri
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, permanentUrl),
    isPostClaim,
    permanentUrl,
    // My previously published claims under this short lbry uri
    myClaimForUri,
    // If I clicked the "edit" button, have I changed the uri?
    // Need this to make it easier to find the source on previously published content
    isStillEditing: selectIsStillEditing(state),
    filePath: selectPublishFormValue(state, 'filePath'),
    remoteUrl: selectPublishFormValue(state, 'remoteFileUrl'),
    publishSuccess: selectPublishFormValue(state, 'publishSuccess'),
    totalRewardValue: selectUnclaimedRewardValue(state),
    modal: selectModal(state),
    enablePublishPreview: selectClientSetting(state, SETTINGS.ENABLE_PUBLISH_PREVIEW),
    activeChannelClaim: selectActiveChannelClaim(state),
    incognito: selectIncognito(state),
    isClaimingInitialRewards: selectIsClaimingInitialRewards(state),
    hasClaimedInitialRewards: selectHasClaimedInitialRewards(state),
    balance: selectBalance(state),
  };
};

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  clearPublish: () => dispatch(doClearPublish()),
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
  checkAvailability: (name) => dispatch(doCheckPublishNameAvailability(name)),
  claimInitialRewards: () => dispatch(doClaimInitialRewards()),
});

export default connect(select, perform)(LivestreamForm);
