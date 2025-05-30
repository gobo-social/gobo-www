// Even though they're not used in this specific file, importing the engines
// responsible for managing feed behavior need to be initialized reliablly.
// We do that here.

import "$lib/engines/identity.js";
import "$lib/engines/filter.js";
import "$lib/engines/notification.js";
import "$lib/engines/feed/index.js";
import "$lib/engines/delivery/index.js";
import { Profile } from "$lib/engines/profile.js";

import { App } from "$lib/engines/app/index.js";

const Bootstrap = {};

// Profile must run first to create a new person if neccessary.
Bootstrap.run = async () => {
  await Profile.startup();
  await App.startup();
};

export {
  Bootstrap
}