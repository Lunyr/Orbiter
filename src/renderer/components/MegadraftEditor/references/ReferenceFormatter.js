import React from 'react';
import Chicago from '../citations/Chicago';
import MLA from '../citations/MLA';

class ReferenceFormatter extends React.Component {
  render() {
    const { reference, formatType } = this.props;
    const Citation = formatType === 'MLA' ? MLA : Chicago;
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
      <Citation
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
  }
}

export default ReferenceFormatter;
