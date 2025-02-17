import { Grant } from "$lib/engines/app/grant.js";
import { Gobo } from "$lib/engines/app/gobo-client.js";
import { PUBLIC_APP_LOGIN_URL } from '$env/static/public';


// Represents logical application.
const App = {};

App.startupList = [];

App.register = ( f ) => App.startupList.push( f );

App.clear = async () => {
  Grant.clear();
  Gobo.clear();
};

App.login = async ({ token }) => {
  await Grant.make({ token });
};

App.logout = () => {
  App.clear();

  // We use native navigation here to firmly reset application state.
  window.location.href = PUBLIC_APP_LOGIN_URL;
  
  // Continue holding the event loop so that we don't have uncaught errors.
  return new Promise();
};

App.getAccessToken = async () => {
  const grant = await Grant.get();
  if ( grant.isExpired() ) {
    await App.logout();
  }
  return grant.token;
};

// Manages discovered stale authorization state with regard to primary Gobo API.
App.unauthorized = ( f ) => {
  return async ( ...args ) => {
    try {
      return await f( ...args );
    } catch ( error ) {
      if ( error.status === 401 ) {
        await App.logout();
      } else {
        throw error
      }
    }
  }
};

App.startup = async () => {
  const promises = [];
  for ( const f of App.startupList ) {
    promises.push( f() );
  }

  // TODO: Generalize this, or write it inline. 
  // This only works because the unauthorized cases pertain to Gobo API.
  await App.unauthorized( async () => {
    await Promise.all( promises );
  })();
};

App.isLoggedOut = async () => {
  const grant = await Grant.get();
  return grant.isExpired();  // checks validity then adds expiration constraint.
};

App.hasAccess = async ( role ) => {
  const grant = await Grant.get();
  return !grant.isExpired() && grant.roles.has( role );
};

App.missingAccess = async ( role ) => {
  const grant = await Grant.get();
  return grant.isExpired() || !grant.roles.has( role );
}


export {
  App
}