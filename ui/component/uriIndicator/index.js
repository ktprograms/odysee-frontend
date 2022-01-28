import { connect } from 'react-redux';
import { normalizeURI } from 'util/lbryURI';
import { doResolveUri } from 'redux/actions/claims';
import { selectIsUriResolving, makeSelectClaimForUri } from 'redux/selectors/claims';
import UriIndicator from './view';
import {
  selectOdyseeMembershipName,
  selectOdyseeMembershipByClaimId,
} from 'redux/selectors/user';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: selectIsUriResolving(state, props.uri),
  uri: normalizeURI(props.uri),
  selectOdyseeMembershipByClaimId: selectOdyseeMembershipByClaimId(state, props.uri),
});

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(UriIndicator);
