import createGoboClient from "gobo-client";
import { Grant } from "$lib/engines/app/grant.js";
import { PUBLIC_GOBO_API } from '$env/static/public';

let singletonGobo;
const Gobo = {};

Gobo.get = async () => {
  singletonGobo ??= (async () => {
    const token = await Grant.getAccessToken();
    return await createGoboClient({
      base: PUBLIC_GOBO_API,
      debug: 1,
      token: token,
    });
  })();

  return await singletonGobo;
};

Gobo.clear = () => {
  singletonGobo = null;
};

export { 
  Gobo 
}