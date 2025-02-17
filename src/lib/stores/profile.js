import { writable } from "svelte/store";

const createStore = function () {
  let profile = {};
  
  const { subscribe, update } = writable( profile );

  return {
    subscribe,
    setProfile: function ( data ) {
      update( function () {
        return data;
      });
    },
    updateProfile: function ( data ) {
      update( function ( profile ) {
        Object.assign( profile, data );
        return profile;
      });
    },
  };
};


export const profileStore = createStore();
