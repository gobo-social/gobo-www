import { Gobo } from "$lib/engines/app/index.js";


const Actions = {};

Actions.resendEmailVerification = async () => {
  const client = await Gobo.get();
  await client.actionResendEmailVerification.post({
    parameters: { person_id: client.id },
  });
};


export {
  Actions
}