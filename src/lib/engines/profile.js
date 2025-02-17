import { Grant } from "$lib/engines/app/index.js";
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
  profileStore.update( profile );
};

Profile.load = App.unauthorized( async () => {
  const grant = await Grant.get();
  const profile = await Me.get();

  if ( !profile.name ) {
    profile.name = grant.claims.email;
  }

  Profile.set( profile );
});

Profile.update = async ( data ) => {
  const profile = Profile.get();
  Object.assign( profile, data );
  Profile.set( profile );
  await PersonProfile.put( profile );
};

// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Profile.startup = async () => {
  if ( await App.hasAccess( "general" )) {
    await Profile.load();
  }
};

App.register( Profile.startup );

export {
  Profile
}