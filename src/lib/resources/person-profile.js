import { App, Gobo } from "$lib/engines/app/index.js";

// The person.id vs person_id is a little gross, but it's coming from
// how we handle self-assembly in the client and API. It's valuable, but
// it does leave us with a naming problem around a person's address.
const put = App.unauthorized(async ( profile ) => {
  const client = await Gobo.get();
  profile.person_id = client.id;
  return await client.personProfile.put( profile );
});

export {
  put
}