
const categorize = function ( identity ) {
  identity.key = identity.identity_id;
  identity.active = false;
  
  switch ( identity.base_url ) {
    case "twitter.com":
      identity.type = "twitter";
      break;
    case "www.reddit.com":
      identity.type = "reddit";
      break;
    default:
      identity.type = "mastodon"; 
  }

  return addUsername( identity );
};


const getUsername = function ( identity ) {
  let hostname;
  const { username, type, base_url } = identity;

  switch ( type ) {
    case "twitter":
      return `@${ username }`;
      break;
    case "reddit":
      return `u/${ username }`;
      break;
    case "mastodon":
      // We just want the hostname to form a fully specified Mastodon reference.
      if ( base_url.startsWith( "https://" ) === true ) {
        let url = new URL( base_url );
        hostname = url.hostname;
      } else {
        hostname = base_url;
      }
      
      return `@${ username }@${ hostname }`;
      break;
  }
};

const addUsername = function ( identity ) {
  identity.fullUsername = getUsername( identity );
  return identity;
};


const sort = function ( identities ) {
  let mastodons = [];
  let reddits = [];
  let twitters = [];

  for ( let identity of identities ) {
    identity = categorize( identity ); 

    if ( identity.type === "twitter" ) {
      twitters.push( identity );
    } else if ( identity.type === "reddit" ) {
      reddits.push( identity );
    } else if ( identity.type === "mastodon" ) {
      mastodons.push( identity );
    }
  }

  return [ ...mastodons, ...reddits, ...twitters ];
};



export {
  categorize,
  getUsername,
  addUsername,
  sort
}