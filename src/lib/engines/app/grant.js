import { OutsetaGrant } from "$lib/engines/app/outseta-grant.js";
import * as LS from "$lib/helpers/local-storage.js";

let singletonGrant;
const Grant = {};

Grant.fetch = async () => {
  const token = LS.read( "gobo.outseta-token" );
  return OutsetaGrant.make({ token });
};

Grant.get = async () => {
  singletonGrant ??= Grant.fetch();
  return singletonGrant;
};

Grant.make = async ({ token }) => {
  LS.write( "gobo.outseta-token", token );
  singletonGrant = OutsetaGrant.make({ token });
};

Grant.clear = () => {
  LS.remove( "gobo.outseta-token" );
  singletonGrant = null;
};

export {
  Grant
}
