export const read = ( name ) => {
  const string = window.localStorage.getItem( name );
  if ( string != null ) {
    return JSON.parse( string );
  } else {
    return null;
  }
};

export const write = ( name, object ) => {
  if ( object == null ) {
    remove( name );
  } else {
    window.localStorage.setItem( name, JSON.stringify( object ));
  }
};

export const remove = ( name ) => {
  window.localStorage.removeItem( name );
};

export const clear = () => {
  window.localStorage.clear();
};