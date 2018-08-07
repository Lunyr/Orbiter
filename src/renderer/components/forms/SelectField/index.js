import React from 'react';
import injectStyles from 'react-jss';
import Select from '../../selects/Select';
import FieldError from '../FieldError';
import styles from '../styles';

export default injectStyles(styles)(
  ({ classes, input: field, options, multi = false, meta, menuPortalTarget, disabled }) => (
    <div className={classes.field}>
      <Select
        cacheOptions={false}
        defaultOptions={true}
        isDisabled={disabled}
        isMulti={multi}
        isClearable={true}
        isSearchable={true}
        menuPortalTarget={menuPortalTarget}
        onChange={field.onChange}
        options={options}
        value={field.value}
      />
      <FieldError {...meta} />
    </div>
  )
);
