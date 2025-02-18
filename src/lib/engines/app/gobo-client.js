import createGoboClient from "gobo-client";
import { App } from "$lib/engines/app/app.js";
import { PUBLIC_GOBO_API } from '$env/static/public';

let singletonGobo;
const Gobo = {};

// This instantiates a Gobo API client. This client was designed to operate
// from the logical application's perspective. That's why it's in the logical
// application's directory and why it accepts the "setProfile" perspective.
// That makes it much easier to write flows that involve resources that belong
// to a particular person.

// TODO: This isn't quite right. gobo-client needs to stay relatively generic,
// but it's definitely valuable to have a person-centric layer that can
// seat the generic client and use it to assist person-centric flows in the
// logical application.

Gobo.setup = async () => {
  const token = await App.getAccessToken();
  const client = await createGoboClient({
    base: PUBLIC_GOBO_API,
    debug: 1,
    token: token,
  });

  const profile = await client.me.get();
  client.setProfile( profile );
  return client;
};

// Careful here. If the Gobo API client does not exist, we start setting it
// up but avoid yielding the event loop to keep the singleton pattern. If
// another caller comes along, they'll just wait for the same client.
// Separately, every time someone needs to use the client, we make sure the 
// access token is valid, otherwise signal to the logical application that
// a login flow is required.

Gobo.get = async () => {
  if ( singletonGobo ) {
    await App.getAccessToken();
  } else {
    singletonGobo = Gobo.setup();
  }
  return await singletonGobo;
};

Gobo.clear = () => {
  singletonGobo = null;
};

export { 
  Gobo 
}