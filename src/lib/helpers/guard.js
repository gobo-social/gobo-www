import { goto } from "$app/navigation";
import { App } from "$lib/engines/app/index.js";


export async function guard() {
  try {
    if ( await App.isLoggedOut() ) {
      return goto( "/" );
    }

    if ( await App.missingAccess( "general" )) {
      return goto( "/permissions" );
    }

  } catch ( error ) {
    console.error( error );
    await App.logout();
  }
}