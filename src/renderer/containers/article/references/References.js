import React from 'react';
import injectStyles from 'react-jss';
import { FormattedMessage } from 'react-intl';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { Citation } from '../../../components';

const ReferenceFormatter = ({ reference, formatType }) => {
  const CitationComponent = formatType === 'MLA' ? Citation.MLA : Citation.Chicago;
  const {
    firstName,
    lastName,
    publisher,
    title,
    url,
    website,
    lastAccessed,
    pagesCite,
    typeOfReference,
    yearOfPub,
  } = reference;
  return (
    <CitationComponent
      fieldValues={{
        author: `${lastName}, ${firstName}`,
        contributingOrganization: publisher,
        currentDate: lastAccessed ? new Date(lastAccessed).toLocaleString() : '',
        pagesCite,
        refName: title,
        title,
        type: typeOfReference,
        url,
        website,
        yearOfPub,
      }}
    />
  );
};

class References extends React.Component {
  static defaultProps = {
    formatType: 'MLA',
  };

  getValidReferences = () => {
    const { references } = this.props;
    return flatten(
      orderBy(
        reduce(
          references,
          (acc, { data, referenceArray: refArray }) => {
            const referenceArray = data ? data.referenceArray : refArray;
            if (!isEmpty(referenceArray)) {
              acc.push(referenceArray);
            }
            return acc;
          },
          []
        ),
        'refNum'
      )
    );
  };

  render() {
    const { classes, formatType } = this.props;
    const validReferences = this.getValidReferences();
    return (
      <div className={classes.references}>
        {isEmpty(validReferences) ? (
          <p className={classes.empty}>
            <FormattedMessage
              id="References.empty"
              defaultMessage="No references or citations have been added."
            />
          </p>
        ) : (
          map(validReferences, (reference, index) => {
            return (
              <div className={classes.reference} key={`reference_show_${index}`}>
                <div className={classes.reference__inner}>
                  <span className={classes.numbering}>{`${index + 1}.`}</span>
                  <span className={classes.text}>
                    <ReferenceFormatter reference={reference} formatType={formatType} />
                  </span>
                </div>
                {index !== size(validReferences) - 1 && <hr className={classes.divider} />}
              </div>
            );
          })
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  references: {
    display: 'flex',
    flexDirection: 'column',
  },
  reference: {
    overflowWrap: 'break-word',
    width: '100%',
  },
  reference__inner: {
    display: 'inline-flex',
    ...theme.typography.body,
    marginBottom: theme.spacing,
  },
  text: {
    width: '100%',
    color: theme.colors.black,
    fontSize: '0.9rem',
  },
  numbering: {
    marginRight: '15px',
    fontSize: '0.9rem',
  },
  divider: {
    border: '1px solid rbga(0, 0, 0, 0.1)',
    width: '100%',
    opacity: 0.2,
  },
  empty: theme.typography.body,
});

export default injectStyles(styles)(References);
