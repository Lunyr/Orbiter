import React from 'react';
import flowRight from 'lodash/flowRight';

export default function citationRender(CitationFormat) {
  return class Citation extends React.Component {
    _affix = (value, prefix, suffix) => {
      return value ? prefix + value + suffix : '';
    };

    _values = mappings => {
      const { fieldValues } = this.props;
      return mappings
        .reduce((acc, field) => {
          const fieldName = Object.keys(field)[0];
          const val = fieldValues[fieldName];
          if (val) {
            const { formatters, prefix, suffix } = field[fieldName];
            acc.push(this._affix(this._format(val, formatters), prefix, suffix));
          }
          return acc;
        }, [])
        .join('');
    };

    _format = (value, formatters) => {
      return !formatters ? value : flowRight(formatters)(value);
    };

    _overrideMapping = mapping => {
      const { mappings } = this.props;
      return mappings.map(mappingOverride => {
        if (mapping[Object.keys(mappingOverride)[0]]) {
          return mappingOverride;
        } else {
          return mapping;
        }
      });
    };

    overrideMappings = mappings => {
      return mappings.map(mapping => {
        return this._overrideMapping(mapping)[0];
      });
    };

    renderCitation = ({ mappings = [], renderHtml = false, prefix = '', suffix = '' }) => {
      if (renderHtml) {
        return (
          <span>
            <div dangerouslySetInnerHTML={{ __html: prefix + this._values(mappings) + suffix }} />
          </span>
        );
      } else {
        return (
          <span>
            {prefix}
            {this._values(mappings)}
            {prefix}
          </span>
        );
      }
    };

    render() {
      return (
        <CitationFormat
          {...this.props}
          overrideMappings={this.overrideMappings}
          renderCitation={this.renderCitation}
        />
      );
    }
  };
}
