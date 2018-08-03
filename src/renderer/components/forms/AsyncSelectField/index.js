import React from 'react';
import injectStyles from 'react-jss';
import AsyncSelect from 'react-select/lib/Async';
import FieldError from '../FieldError';
import styles from '../styles';

export default injectStyles(styles)(
  ({ classes, input: field, loadOptions, multi = false, meta, menuPortalTarget, disabled }) => (
    <div className={classes.field}>
      <AsyncSelect
        cacheOptions={false}
        defaultOptions={true}
        isClearable={true}
        isDisabled={disabled}
        isMulti={multi}
        isSearchable={true}
        loadOptions={loadOptions}
        menuPortalTarget={menuPortalTarget}
        onChange={field.onChange}
        value={field.value}
      />
      <FieldError {...meta} />
    </div>
  )
);
