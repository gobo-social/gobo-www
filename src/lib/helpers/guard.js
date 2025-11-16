import { goto } from "$app/navigation";
import { App } from "$lib/engines/app/index.js";


export async function guard() {
  try {
    await App.logout();
    return goto( "/" );
  } catch ( error ) {
    console.error( error );
    await App.logout();
  }
}