import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import uuidv4 from 'uuid/v4';
import { createDraft } from '../../../../shared/redux/modules/article/draft/actions';
import { LoadingIndicator } from '../../../components';

class DraftCreator extends React.Component {
  state = {
    created: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.data) {
      if (!prevProps.data || this.props.data.uuid !== prevProps.data.uuid) {
        this.setState({ created: true });
      }
    }
  }

  componentDidMount() {
    // Generate a draft uuid to store as an id
    this.setState({ created: false }, () => {
      this.props.createDraft({
        account: this.props.account,
        uuid: uuidv4(),
      });
    });
  }

  render() {
    const { data } = this.props;
    const { created } = this.state;
    return created && data && data.uuid ? (
      <Redirect to={`/draft/${data.uuid}`} />
    ) : (
      <LoadingIndicator
        id="logout-loading-indicator"
        fadeIn="quarter"
        showing={true}
        size={15}
        full={true}
        text="Creating draft..."
      />
    );
  }
}

const mapStateToProps = ({
  auth: { account },
  article: {
    draft: { data },
  },
}) => ({
  account,
  data,
});

export default connect(
  mapStateToProps,
  { createDraft }
)(DraftCreator);
