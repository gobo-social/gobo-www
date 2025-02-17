import { Gobo, App } from "$lib/engines/app/index.js";

const get = App.unauthorized( async () => {
  const client = await Gobo.get();
  return await client.me.get();
});

export {
  get
}