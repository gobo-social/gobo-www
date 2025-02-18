import { Gobo, App } from "$lib/engines/app/index.js";


const create = App.unauthorized(async ( kernel ) => {
  const client = await Gobo.get();
  kernel.person_id ??= client.id;
  return await client.personDrafts.post({
    parameters: { person_id: client.id },
    content: kernel,
  });
});


const remove = App.unauthorized(async ( draft ) => {
  const client = await Gobo.get();
  return await client.personDraft.delete({
    person_id: client.id,
    id: draft.id
  });
});

const update = App.unauthorized(async ( draft ) => {
  const client = await Gobo.get();
  return await client.personDraft.put({
    parameters: { 
      person_id: client.id,
      id: draft.id
    },
    content: draft,
  });
});


export {
  create,
  remove,
  update
}