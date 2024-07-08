import { Platforms } from "$lib/engines/platforms/index.js";
import { Preview } from "$lib/engines/link-preview.js";
import { toMarkdown } from "$lib/helpers/markdown.js";

const parser = new DOMParser();
const DELIMITER = "GOBO-THREADPOINT--";

const Thread = {};

// Figure out which platforms we are actively considering for this draft.
Thread.getPlatforms = ( draft ) => {
  const current = new Set();
  for ( const identity of draft.identities ) {
    if ( identity.active === true ) {
      current.add( identity.platform );
    }
  }
  return Array.from( current );
};

Thread.ignoredPlatforms = new Set([
  "linkedin",
  "reddit"
]);


Thread.find = ( thread, index, platform ) => {
  const row = thread?.[ index ] ?? []
  const item = row.find( i => i.platform === platform );
  return item;
};

Thread.findID = ( thread, id ) => {
  for ( const row of thread ) {
    for ( const item of row ) {
      if ( item.id === id ) {
        return item;
      }
    }
  }

  // Like Array#find, returns undefined if it's not here.
  return;
}


Thread.parse = ( draft ) => {
  const old = draft.thread;
  const raw = draft.content;
  const platforms = Thread.getPlatforms( draft );
  
  const results = [];
  for ( const platform of platforms ) {
    const dom = parser.parseFromString( 
      `<div id='outermost'> ${raw} </div>`, 
      "text/html"
    );

    // First, purge threadpoints from other platforms.      
    const others = dom.querySelectorAll( 
      `span.threadpoint:not([data-platform='${ platform }'])`
    );
    for ( const el of others ) {
      el.remove();
    }

    // Now gather matching threadpoints
    const matches = dom.querySelectorAll( "span.threadpoint" );
    
    // Save the attachment metadata we store on the threadponts.
    const threadpoints = [];
    threadpoints.push({ id: "head" });
    for ( const el of matches ) {
      threadpoints.push({ id: el.dataset.id });
    }
    
    // Convert the threadpoints into plaintext-compatible delimiters.
    for ( const el of matches ) {
      el.innerHTML = DELIMITER;      
    }

    // Now get back the modified HTML.
    const html = dom.querySelector("#outermost").innerHTML;
    
    // We convert this to Markdown for several reasons:
    // 1. Platforms ultimately expect posts to be in a more plaintext form, not HTML
    // 2. We need to support arbitrary character splitting, and HTML tags complicate that
    // 3. Because of (1), our length calculations rely on plaintext characters.
    const markdown = toMarkdown( html );
    const parts = markdown.split( DELIMITER );
    
    // Assemble the parts for this platform alongside the other platforms.
    let index = 0;
    for ( const part of parts ) {
      const oldItem = Thread.find( old, index, platform );
      const item = { 
        id: threadpoints[ index ].id,
        index,
        platform, 
        content: part.trim(), 
        attachments: oldItem?.attachments ?? []
      };

      Preview.decorateItem( item );
      results[ index ] ??= [];
      results[ index ].push( item );
      index++;
    }
  }

  return results;
};


export {
  Thread
}