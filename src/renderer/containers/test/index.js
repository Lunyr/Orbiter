import React from 'react';
import { connect } from 'react-redux';
import { fetchTestData } from '../../../shared/redux/modules/app/actions';

class Test extends React.Component {
  componentDidMount() {
    this.props.onFetchFeed();
  }

  render() {
    const { data, loading } = this.props;
    return (
      <div>
        {loading ? (
          <span>Loading it up!</span>
        ) : (
          <React.Fragment>
            <h1>All the app datas</h1>
            {JSON.stringify(data)}
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  ...app,
});

const mapDispatchToProps = {
  onFetchFeed: fetchTestData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);
