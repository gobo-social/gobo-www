import { App, Grant } from "$lib/engines/app/index.js";
import * as Me from "$lib/resources/me.js";
import * as PersonProfile from "$lib/resources/person-profile.js";
import { profileStore } from "$lib/stores/profile.js";

let singletonProfile;
const Profile = {};

Profile.get = () => {
  singletonProfile ??= {};
  return singletonProfile;
};

Profile.put = ( profile ) => {
  singletonProfile = profile;
  profileStore.set( profile );
};

Profile.load = async () => {
  const grant = await Grant.get();
  const profile = await Me.get();
  // TODO: Do we want to make this configurable based on name? And if so,
  // do we need a way to propogate name updates without a login flow?
  const name = grant.claims.email;

  if ( profile.name !== name ) {
    profile.name = name;
    Profile.put( profile );
    Profile.update( profile );
  } else {
    Profile.put( profile );
  }
};

Profile.update = async ( data ) => {
  const profile = Profile.get();
  Object.assign( profile, data );
  Profile.put( profile );
  await PersonProfile.put( profile );
};

// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Profile.startup = async () => {
  if ( await App.hasAccess( "general" )) {
    await Profile.load();
  }
};

export {
  Profile
}