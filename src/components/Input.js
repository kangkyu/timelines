
import React, { PropTypes } from 'react';

const fontSize = 'large';

const style = {
  // border: 'solid 2px red',

  inputText: {
    margin: '8px',
    width: '310px',
    fontSize
  },

  button: { fontSize }
};

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickWrapper = this.handleClickWrapper.bind(this);
  }

  static propTypes() { return {
    handleChangeGroupSpecifier: PropTypes.func.isRequired,
    handleChangeApiKey: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired
  } }

  handleClickWrapper() {
    this.refs.inputGroupSpecifier.value = '';
    this.refs.inputApiKeyInput.value = '';
    this.props.handleClick();
  }

  render() {
    const {
      handleChangeGroupSpecifier,
      handleChangeApiKey
    } = this.props;

    return (
      <div style={style}>
        <input
          type="text"
          onChange={handleChangeGroupSpecifier}
          style={style.inputText}
          placeholder="meetup.com group URL or URL name"
          ref="inputGroupSpecifier"
        />

        <input
          type="text"
          onChange={handleChangeApiKey}
          style={style.inputText}
          placeholder="Your meetup.com API key"
          ref="inputApiKeyInput"
        />

        <button
          type="input"
          onClick={this.handleClickWrapper}
          style={style.button}
        >
          Submit
        </button>
      </div>
    );
  }
}

// const Input = ({
//   handleChangeGroupSpecifier,
//   groupSpecifierValue,

//   handleChangeApiKey,
//   handleClick
// }) => (
//   <div style={style}>
//     <input
//       type="text"
//       onChange={handleChangeGroupSpecifier}
//       style={style.inputText}
//       placeholder="meetup.com group URL or URL name"
//       value={groupSpecifierValue}
//     />

//     <input
//       type="text"
//       onChange={handleChangeApiKey}
//       style={style.inputText}
//       placeholder="Your meetup.com API key"
//     />

//     <button type="input" onClick={handleClick} style={style.button} >Submit</button>
//   </div>
// );

// Input.propTypes = {
//   handleChangeGroupSpecifier: PropTypes.func.isRequired,
//   handleChangeApiKey: PropTypes.func.isRequired,
//   handleClick: PropTypes.func.isRequired
// };

// export default Input;
