import React, { Component, PropTypes } from 'react';

export default class Picker extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <span>

        // value = this.props.value = selectedReddit
        <h1>{value}</h1>

        // onChangeが動くと、 this.props.onChange が動き、
        // 親にある this.handleChange が発火、
        <select onChange={e => onChange(e.target.value)}
                value={value}>

          // options={['reactjs', 'frontend']}がmapされる
          {options.map(option =>
            <option value={option} key={option}>
              {option}
            </option>)
          }

        </select>
      </span>
    );
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
