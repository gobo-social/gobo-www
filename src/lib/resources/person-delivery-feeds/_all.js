import { Gobo, App } from "$lib/engines/app/index.js";


const list = App.unauthorized( async function ( options ) {
  const client = await Gobo.get();
  return await client.personDeliveries.get({ 
    person_id: client.id,
    per_page: options.per_page,
    start: options.start
  });
});


export { list }