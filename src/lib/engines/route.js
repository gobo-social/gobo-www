import { goto } from "$app/navigation";
import * as LS from  "$lib/helpers/local-storage.js";
import { App, Gobo } from "$lib/engines/app/index.js";
import { Identity as IdentityEngine } from "$lib/engines/identity.js";
import { Bootstrap } from "$lib/engines/bootstrap.js";
import * as Welcome from "$lib/helpers/welcome.js";

// The searchParams instance has some nuance for querystrings that we don't need.
// Convert to plain object to make the individual handlers easier to write.
const extractQuery = function ( url ) {
  const output = {};
  for ( const entry of url.searchParams.entries() ) {
    output[ entry[0] ] = entry[1];
  }
  return output;
};

// TODO: We need a landing page to direct people when there is callback problem.
const handleCallbackError = async function () {
  goto( "/callback-error" );
};

const successfulAuth = async () => {
  await Bootstrap.run();
  
  if ( await App.missingAccess( "general" )) {
    return goto( "/permissions" );
  }

  const welcome = await Welcome.get();
  if ( welcome == null ) {
    return goto( "/welcome" );
  } else {
    return goto( "/home" );
  }
};

const Callback = {};

Callback.auth = async ( query ) => {
  // TODO: Do we need the email verification flow for Outseta?

  // We're sent back to the callback origin after verifying our email address.
  // This will force a logout so the member can login again with an
  // email verification claim that's true.
  // if ( query.logout === "true" ) {
  //   return await App.logout();
  // }

  console.log( "Starting primary authentication callback", query );
  const { access_token } = query;

  if ( await App.isLoggedOut() ) {  
    if ( !access_token ) {
      console.log( "auth callback lacks expected credentials", query );
      return await handleCallbackError();
    }
    await App.login({ token: access_token });
    return await successfulAuth();
  
  } else {
    // Passthrough for now. Happens if client back buttons to callback.
    console.log( "auth credentials already loaded" );
    return await successfulAuth();
  }
};


const Identity = {};

// Housekeeping to prevent storing secret values inappropriately.
Identity.clearStorage = () => {
  LS.remove( "gobo-platform" );
  LS.remove( "gobo-baseURL" );
  LS.remove( "gobo-bluesky-login" );
  LS.remove( "gobo-bluesky-secret" );
};

// The HTTP API endpoint for this second step is robust enough to handle
// all the possibilities shoved together. So provide all available information.
Identity.add = async ( query ) => {
  const client = await Gobo.get();

  await client.actionOnboardIdentityCallback.post({ 
    content: {
      platform: LS.read( "gobo-platform" ),
      base_url: LS.read( "gobo-baseURL" ),
      bluesky_login: LS.read( "gobo-bluesky-login" ) ?? undefined,
      bluesky_secret: LS.read( "gobo-bluesky-secret" ) ?? undefined,
      oauth_token: query.oauth_token ?? undefined,
      oauth_verifier: query.oauth_verifier ?? undefined,
      code: query.code ?? undefined,
      state: query.state ?? undefined,
  }});
};

// Handles callbacks from third-party platforms.
Callback.identity = async ( query ) => {
  console.log( "Starting add identity callback", query );
  
  try {
    // POSTs aren't idempotent, so we use baseURL to detect duplication.
    if ( LS.read( "gobo-baseURL" ) == null ) {
      Identity.clearStorage();
      return goto( "/settings/identities" );
    }

    await Identity.add( query );
    Identity.clearStorage();
    LS.write( "gobo-building-feed", true );
    IdentityEngine.refresh();
    return goto( "/settings/identities" );
  
  } catch ( error ) {
    console.error( error );
    Identity.clearStorage();
    return goto( "/settings/identities/add/failure" );
  }
};


const Route = {};

// Take care to avoid an infinite routing loop.
Route.default = async () => {
  if ( (await App.isLoggedOut()) ) {
    // We can stop here.
  } else {
    try {
      if ( await App.hasAccess( "general" )) {
        // This person is allowed access to application features.
        return goto( "/home" );
      } else {
        return goto( "/permissions" );
      }
    } catch ( error ) {
      console.error( error );
      await App.logout();
    }
  }
};

// Detect and handle any redirect or callback.
Route.handle = async () => {
  try {
    const url = new URL( document.location );
    const query = extractQuery( url );
    Bootstrap.run();
    
    switch ( url.pathname ) {
      case "/":
        // Logged in people need to be sent Home
        await Route.default();
        break;
      case "/auth-callback":
        // Callback from Auth0, primary application authentication
        await Callback.auth( query );
        break;
      case "/add-identity-callback":
        // Identity authentication from Mastodon, Reddit, and Twitter
        await Callback.identity( query );
        break;
      default:
        // No-op passthrough
        return null;        
    }
  } catch ( error ) {
    console.error( error );
    await handleCallbackError();
  }
};

export { 
  Route
}