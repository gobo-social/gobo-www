import { goto } from "$app/navigation";
import { Grant } from "$lib/engines/app/grant.js";
import { Gobo } from "$lib/engines/app/gobo-client.js";
import * as LS from "$lib/helpers/local-storage.js";
import { PUBLIC_APP_LOGIN_URL } from '$env/static/public';


// Represents logical application.
const App = {};

App.startupList = [];
App.shutdownList = [];

App.registerStartup = ( f ) => App.startupList.push( f );
App.registerShutdown = ( f ) => App.shutdownList.push( f );

App.clear = async () => {
  await App.shutdown();
  Grant.clear();
  Gobo.clear();
  LS.clear();
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

  try {
    await Promise.all( promises );
  } catch ( error ) {
    console.error( "encountered problem during login", error );
    await App.shutdown();
    goto( "/login-problem" );
  }
};

App.shutdown = async () => {
  const promises = [];
  for ( const f of App.shutdownList ) {
    promises.push( f() );
  }

  try {
    await Promise.all( promises );
  } catch ( error ) {
    console.error( "encountered problem during shutdown", error );
    LS.clear(); // Best effort to cleanup in the worst case.
  }  
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