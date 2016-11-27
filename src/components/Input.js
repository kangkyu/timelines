
import React, { PropTypes } from 'react';

import { getUserSession } from '../containers/meetup';

const online = () => {
  const session = getUserSession();
  const currentTime = (new Date()).getTime() / 1000;
  const isOnline = session && session.access_token && session.expires > currentTime;
  return isOnline;
};

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

const commonPropTypes = {
  handleChangeApiKey: PropTypes.func.isRequired,
  isDevEnv: PropTypes.bool
};

const APIKey = ({ handleChangeApiKey, isDevEnv, refFunc }) => {
  const apiKeyPlaceHolder = getApiKeyPlaceHolder();

  if (!isDevEnv) return null;

  return (
    <input
      type="text"
      onChange={handleChangeApiKey}
      style={style.inputText}
      placeholder={apiKeyPlaceHolder}
      ref={refFunc}
    />
  );
};

APIKey.propTypes = {
  ...commonPropTypes, refFunc: PropTypes.func.isRequired
};

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickWrapper = this.handleClickWrapper.bind(this);
  }

  handleClickWrapper() {
    this.inputGroupSpecifier.value = '';
    this.props.handleClick();
    if (this.props.isDevEnv) this.inputApiKeyInput.value = '';
  }

  render() {
    // console.warn('CORS...');
    // return null;

    const { handleChangeGroupSpecifier, handleChangeApiKey, isDevEnv } = this.props;

    if (!online() && !isDevEnv) return null;

    return (
      <div style={style}>
        <input
          type="text"
          onChange={handleChangeGroupSpecifier}
          style={style.inputText}
          placeholder="meetup.com group URL or URL name"
          ref={(input) => { this.inputGroupSpecifier = input; }}
        />

        <APIKey
          handleChangeApiKey={handleChangeApiKey}
          isDevEnv={isDevEnv}
          refFunc={(input) => { this.inputApiKeyInput = input; }}
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

Input.propTypes = {
  ...commonPropTypes,
  handleChangeGroupSpecifier: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};
