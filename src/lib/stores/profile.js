import { writable } from "svelte/store";

const createStore = function () {
  let profile = {};
  
  const { subscribe, update } = writable( profile );

  return {
    subscribe,
    set: function ( data ) {
      update( function () {
        return data;
      });
    },
    update: function ( data ) {
      update( function ( profile ) {
        Object.assign( profile, data );
        return profile;
      });
    },
  };
};


export const profileStore = createStore();
