
import React from 'react';
import * as hello from 'hellojs';

import LoginComponent from '../components/Login';
import meetup from './meetup';

const NETWORK = meetup;
const CLIENT_ID = '1a61nl2lj8vejb3tg5irbq847s';
const initArgs = [{ [NETWORK]: CLIENT_ID }];

export const getMeetupSession = () => hello.getAuthResponse(NETWORK);

const online = () => {
  const session = getMeetupSession();
  const currentTime = (new Date()).getTime() / 1000;
  const isOnline = session && session.access_token && session.expires > currentTime;
  return isOnline;
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    // hello.init(...initArgs);

    this.state = {
      network: NETWORK,
      session: hello.getAuthResponse(NETWORK)
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    console.log({ session: this.state.session });
  }

  login() {
    // meetupInit(hello);

    hello.init(...initArgs);

    hello.login(NETWORK).then(() => {
      const session = hello.getAuthResponse(NETWORK);
      console.log({ loginOK: session });

      this.setState({ session });
    }, (err) => {
      console.error(err);
    });
  }

  logout() {
    hello.logout(NETWORK).then(() => {
      console.log('Logged out successfully');

      this.setState({ session: null });
    }, (err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <LoginComponent
        online={online}
        login={this.login}
        logout={this.logout}
        network={this.state.network}
        session={this.state.session}
      />
    );
  }
}
