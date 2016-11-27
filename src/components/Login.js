
import React, { PropTypes } from 'react';

const commonPropTypes = {
  online: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  network: PropTypes.string.isRequired,
  session: PropTypes.shape()
};

const InOrOut = ({ online, login, logout, network, session }) => {
  if (online()) {
    return (
      <div>
        <p>Logged in as {session}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <p>To see more updated data, log in to your {network} account</p>
      <button onClick={login}>Login</button>
    </div>
  );
};

InOrOut.propTypes = commonPropTypes;

const style = {
  marginTop: '20px',
  paddingBottom: '20px',
  // border: '2px solid red'
};

const LoginComponent = ({ online, login, logout, network, session }) => (
  <div style={style}>
    <InOrOut
      online={online}
      login={login}
      logout={logout}
      network={network}
      session={session}
    />
  </div>
);

LoginComponent.propTypes = commonPropTypes;

export default LoginComponent;
