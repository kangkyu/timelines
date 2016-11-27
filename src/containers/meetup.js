
import * as helloMain from 'hellojs';

const network = 'meetup';

const meetupInit = (hello) => {
  hello.init({
    [network]: {
      name: 'Timelines',

      oauth: {
        version: 2,
        auth: 'https://secure.meetup.com/oauth2/authorize',
        grant: 'https://secure.meetup.com/oauth2/access',

        // ...
        response_type: 'token',

        // ...
        force: true
        // scope: 'basic'
      },

      base: 'https://api.meetup.com/',
      redirect_uri: 'https://server-monitor.github.io/'
    },

    login(p) {
      console.log({ DEBUG_after_login: p });
    }
  });
};

meetupInit(helloMain);

export default network;
