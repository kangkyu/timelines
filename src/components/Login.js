
import React, { PropTypes } from 'react';

const commonPropTypes = {
  online: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  network: PropTypes.string.isRequired,
  isDevEnv: PropTypes.bool
};

const InOrOut = ({ online, login, logout, network, isDevEnv }) => {
  if (online()) {
    return (
      <div>
        <p>Logged in</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  const msg = isDevEnv ? 'No log in required under dev env' : `To see more updated data, log in to your ${network} account`;

  return (
    <div>
      <p>{msg}</p>
      <button onClick={login} disabled={isDevEnv} >Login</button>
    </div>
  );
};

InOrOut.propTypes = commonPropTypes;

const style = {
  marginTop: '20px',
  paddingBottom: '20px',
};

const LoginComponent = ({ online, login, logout, network, isDevEnv }) => (
  <div style={style}>
    <InOrOut
      online={online}
      login={login}
      logout={logout}
      network={network}
      isDevEnv={isDevEnv}
    />
  </div>
);

LoginComponent.propTypes = commonPropTypes;

export default LoginComponent;
