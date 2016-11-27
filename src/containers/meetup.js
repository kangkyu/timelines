
import * as helloMain from 'hellojs';

export const networkString = 'meetup';
export const getUserSession = () => helloMain.getAuthResponse(networkString);

const meetupInit = (hello) => {
  hello.init({
    [networkString]: {
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
