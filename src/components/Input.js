
import React, { PropTypes } from 'react';

export const API_KEY_LOCAL_STORE_KEY = 'API_KEY';

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

const getApiKeyPlaceHolder = () => {
  const defaultText = 'Your meetup.com API key';
  const apiKey = localStorage.getItem(API_KEY_LOCAL_STORE_KEY);

  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') return defaultText;

  return apiKey;
};

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickWrapper = this.handleClickWrapper.bind(this);
  }

  handleClickWrapper() {
    this.inputGroupSpecifier.value = '';
    this.inputApiKeyInput.value = '';
    this.props.handleClick();
  }

  render() {
    console.warn('CORS...');
    return null;

    // const { handleChangeGroupSpecifier, handleChangeApiKey } = this.props;

    // const apiKeyPlaceHolder = getApiKeyPlaceHolder();

    // return (
    //   <div style={style}>
    //     <input
    //       type="text"
    //       onChange={handleChangeGroupSpecifier}
    //       style={style.inputText}
    //       placeholder="meetup.com group URL or URL name"
    //       ref={(input) => { this.inputGroupSpecifier = input; }}
    //     />

    //     <input
    //       type="text"
    //       onChange={handleChangeApiKey}
    //       style={style.inputText}
    //       placeholder={apiKeyPlaceHolder}
    //       ref={(input) => { this.inputApiKeyInput = input; }}
    //     />

    //     <button
    //       type="input"
    //       onClick={this.handleClickWrapper}
    //       style={style.button}
    //     >
    //       Submit
    //     </button>
    //   </div>
    // );
  }
}

Input.propTypes = {
  handleChangeGroupSpecifier: PropTypes.func.isRequired,
  handleChangeApiKey: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};
