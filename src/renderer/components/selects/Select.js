import React from 'react';
import Select from 'react-select';
import styles from './styles';

export default ({
  className,
  clearable = true,
  disabled,
  multi = false,
  menuPortalTarget,
  onChange,
  options,
  placeholder = 'Select...',
  searachable = true,
  value,
}) => (
  <Select
    cacheOptions={false}
    className={className}
    classNamePrefix={className}
    defaultOptions={true}
    isDisabled={disabled}
    isMulti={multi}
    isClearable={clearable}
    isSearchable={searachable}
    menuPortalTarget={menuPortalTarget}
    onChange={onChange}
    options={options}
    placeholder={placeholder}
    styles={styles({ multi })}
    value={value}
  />
);
