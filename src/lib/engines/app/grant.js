import { OutsetaGrant } from "$lib/engines/account/outseta-grant.js";
import * as LocalStorage from "$lib/helpers/local-storage.js";

let singletonGrant;
const Grant = {};

Grant.fetch = async () => {
  const token = LocalStorage.get( "outseta-token" );
  return OutsetaGrant.make({ token });
};

Grant.get = async () => {
  singletonGrant ??= Grant.fetch();
  return singletonGrant;
};

Grant.make = async ({ token }) => {
  LocalStorage.write( "outseta-token", token );
  singletonGrant = OutsetaGrant.make({ token });
};

Grant.clear = () => {
  LocalStorage.remove( "outseta-token" );
  singletonGrant = null;
};

export {
  Grant
}
