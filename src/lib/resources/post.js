import { Gobo, App } from "$lib/engines/app/index.js";


const get = App.unauthorized(async ({ identity, id }) => {
  const client = await Gobo.get();
  return await client.personIdentityPost.get({ 
    person_id: client.id,
    identity_id: identity,
    id 
  });
});



const publish = App.unauthorized(async ( newPost ) => {
  const client = await Gobo.get();
  return await client.personPosts.post({ 
    parameters: { person_id: client.id },
    content: newPost
  });
});


export {
  get,
  publish
}