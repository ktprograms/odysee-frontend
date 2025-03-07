import { connect } from 'react-redux';
import { selectClaimForUri, selectPreorderTagForUri } from 'redux/selectors/claims';
import { doHideModal, doOpenModal } from 'redux/actions/app';
import { preOrderPurchase } from 'redux/actions/wallet';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectHasSavedCard } from 'redux/selectors/stripe';
import { withRouter } from 'react-router';
import { getChannelIdFromClaim, getChannelNameFromClaim } from 'util/claim';
import PreorderAndPurchaseContent from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri, false);
  const { claim_id: claimId, value_type: claimType } = claim || {};

  // setup variables for backend tip API
  const channelClaimId = getChannelIdFromClaim(claim);
  const tipChannelName = getChannelNameFromClaim(claim);

  const activeChannelClaim = selectActiveChannelClaim(state);
  const { name: activeChannelName, claim_id: activeChannelId } = activeChannelClaim || {};

  return {
    activeChannelName,
    activeChannelId,
    claimId,
    claimType,
    channelClaimId,
    tipChannelName,
    preferredCurrency: selectPreferredCurrency(state),
    preorderTag: selectPreorderTagForUri(state, props.uri),
    hasSavedCard: selectHasSavedCard(state),
  };
};

const perform = {
  doHideModal,
  preOrderPurchase,
  doOpenModal,
};

export default withRouter(connect(select, perform)(PreorderAndPurchaseContent));
