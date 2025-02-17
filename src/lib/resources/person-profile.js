import { App, Gobo } from "$lib/engines/app/index.js";

const put = App.unauthorized(async ( profile ) => {
  const client = await Gobo.get();
  return await client.personProfile.put({
    parameters: { 
      person_id: profile.id
    },
    content: profile,
  });
});

export {
  put
}