import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import styles from './styles';

export default ({
  className,
  clearable = true,
  disabled,
  loadOptions,
  height,
  multi = false,
  menuPortalTarget,
  onChange,
  placeholder = 'Select...',
  searchable = true,
  value,
}) => (
  <AsyncSelect
    cacheOptions={false}
    className={className}
    classNamePrefix={className}
    defaultOptions={true}
    isClearable={clearable}
    isDisabled={disabled}
    isMulti={multi}
    isSearchable={searchable}
    loadOptions={loadOptions}
    menuPortalTarget={menuPortalTarget}
    onChange={onChange}
    placeholder={placeholder}
    styles={styles({ height, multi })}
    value={value}
  />
);
