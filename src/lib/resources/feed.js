import { getGOBOClient, logout } from "$lib/helpers/account.js";
import { Cache, cache } from "$lib/resources/cache.js";

// The following classes play an HTTP intermediary role. They are focused on
// RESTful composition that stablizes this client's request pattern to the GOBO
// HTTP API while building an integrative layer that provides a unified feed as
// a transparent interface.


class Reader {
  constructor ({ identity, filters, per_page, client }) {
    this.identity = identity;
    this.filters = filters;
    this.id = identity.id
    this.per_page = per_page ?? 50;
    this.client = client;
    this.head = null;
    this.tail = null;
    this.queue = [];
    this.unlocksAt = null;
  }

  static async create ({ identity, filters, per_page }) {
    const client = await getGOBOClient();
    per_page = per_page ?? 50;
    return new Reader({ identity, filters, per_page, client });
  }

  async page () {
    try {
      let result;
      while ( true ) {
        result = await this.client.personIdentityFeed.get({ 
          person_id: this.client.id,
          id: this.id,
          per_page: this.per_page,
          start: this.tail
        });
  
        const removals = applyFilters( this.identity, this.filters, result );
        console.log(result)
        
        // This logic allows us to continue pulling if everything is filtered.
        // TODO: risk of infinite loop here. I think it's a pretty strong case
        //    for a state machine refactor because we are scrutinizing 
        //    conditionals mid-flow again.
        if ( removals.size > 0 && result.feed.length === 0 ) {
          this.tail = result.next;
        } else {
          break;
        }
      }
      

      const feed = [];
      const posts = {};
      const sources = {};
      const postEdges = {};

      for ( const post of result.posts ) {
        posts[ post.id ] = post;
      }
      for ( const share of result.shares ?? [] ) {
        posts[ share[0] ].shares ??= [];
        posts[ share[0] ].shares.push( share[1] );
      }
      for ( const thread of result.threads ?? [] ) {
        posts[ thread[0] ].threads ??= [];
        posts[ thread[0] ].threads.push( thread[1] );
      }
      for ( const source of result.sources ) {
        sources[ source.id ] = source;
      }
      for ( const edge of result.post_edges ?? [] ) {
        postEdges[ edge[0] ] ??= new Set();
        postEdges[ edge[0] ].add( edge[1] );
      }
      for ( const id of result.feed ) {
        Cache.addPostCenter( id );
        feed.push( posts[ id ] );
      }

      this.queue.push( ...feed );
      this.head = this.queue[0]?.published;
      this.tail = result.next;
      Cache.putPosts( posts );
      Cache.putSources( sources );
      Cache.decorateMastodon( Object.keys(posts) );
      Cache.putPostEdges( this.id, postEdges );

    } catch (error) {
      if ( error.status === 401 ) {
        await logout();
      } else {
        throw error;
      }
    }
  }

  lock () {
    const date = new Date();
    date.setUTCSeconds( date.getUTCSeconds() + 60 );
    this.unlocksAt = date.toISOString();
  }

  isLocked () {
    return this.unlocksAt != null;
  }
  
  isLockExpired () {
    if ( this.unlocksAt == null ) {
      throw new Error("reader lock expiration is undefined when reader lock is undefined")
    }

    const now = (new Date).toISOString();
    if ( now > this.unlocksAt ) {
      return true;
    } else {
      return false;
    }
  }

  unlock () {
    this.unlocksAt = null;
  }

  isEmpty () {
    return this.queue.length === 0;
  }

  // Ensures the queue is not empty by pulling the next page, if neccessary.
  // We avoid spamming the API with a throttling lock.
  async checkQueue () {
    if ( this.isLocked() ) {
      if ( this.isLockExpired() ) {
        this.unlock();
      } else {
        return;
      }
    }

    if ( this.isEmpty() ) {
      await this.page();
    }

    if ( this.isEmpty() ) {
      this.lock();
    }
  }

  async getHead () {
    if ( this.head == null ) {
      await this.checkQueue();
    }
    return this.head;
  }

  // Fetch the next highest post.
  async next () {
    await this.checkQueue()
    const post = this.queue.shift();
    this.head = this.queue[0]?.published;
    return { identity: this.id, post };
  }
}




class Feed {
  constructor ({ readers }) {
    this.readers = readers;
  }

  static async create ({ identities, filters }) {
    const readers = [];
    for ( const identity of identities ) {
      readers.push( await Reader.create({ identity, filters }) );
    }

    return new Feed({ readers });
  }

  async getActiveReaders () {
    const readers = [];

    // If we need to make any requests to the API, make them in parallel.
    const promises = [];
    for ( const reader of this.readers ) {
      promises.push(reader.getHead());
    }
    await Promise.all( promises );
    
    // Now we can safely assume `.head` is an up-to-date value.
    for ( const reader of this.readers ) {
      if ( reader.head != null ) {
        readers.push( reader );
      }
    }

    return readers;
  }

  // Fetch the reader with the highest head.
  async getNextReader () {
    let match = null;
    const readers = await this.getActiveReaders();
    for ( const reader of readers ) {
      if ( match == null || reader.head > match.head ) {
        match = reader;
      }
    }
    return match;
  }

  // Fetch the next highest scoring post from the reader with the highest head.
  async next () {
    const reader = await this.getNextReader();
    
    if ( reader == null ) {
      return null
    } else {
      return await reader.next();
    }
  }
}



const applyFilters = function ( identity, filters, graph ) {
  const removals = new Set();
  const now = new Date().toISOString();
  const sources = {};
  if ( identity.platform === "reddit" ) {
    for ( const source of graph.sources ) {
      sources[ source.name.toLowerCase() ] = source;
    }
  } else {
    for ( const source of graph.sources ) {
      sources[ source.username.toLowerCase() ] = source;
    }
  }
  

  // Cycle through every individual post looking for posts to exclude.
  for ( const post of graph.posts ) {
    
    // Remove impossible date anomalies.
    if ( post.published > now ) {
      removals.add( post.id );
      continue;
    }

    for ( const filter of filters ) {
      const doesPass = filter.check({ post, sources });
      if ( doesPass !== true ) {
        removals.add( post.id );
        continue;
      }
    }
  }

  // Include all posts in graph connected to excluded posts.
  let currentSize = null;
  while ( currentSize !== removals.size ) {
    currentSize = removals.size;
    const shares = [];
    for ( const share of graph.shares ) {
      if ( removals.has(share[0]) ) {
        removals.add( share[1] );
        continue;
      }
      if ( removals.has( share[1]) ) {
        removals.add( share[0] );
        continue;
      }
      shares.push( share );
    }
    graph.shares = shares;
  }

  currentSize = null;
  while ( currentSize !== removals.size ) {
    currentSize = removals.size;
    const threads = [];
    for ( const thread of graph.threads ) {
      if ( removals.has(thread[0]) ) {
        removals.add( thread[1] );
        continue;
      }
      if ( removals.has( thread[1]) ) {
        removals.add( thread[0] );
        continue;
      }
      threads.push( thread );
    }
    graph.threads = threads;
  }
  

  console.log(`filtered ${removals.size} posts`);


  // Now that we know all exclusions, purge them from post array...
  const posts = [];
  for ( const post of graph.posts ) {
    if ( removals.has(post.id) ) {
      continue;
    }
    posts.push( post );
  }
  graph.posts = posts;

  // ...and from the feed array.
  const feed = [];
  for ( const id of graph.feed ) {
    if ( removals.has(id) ) {
      continue;
    }
    feed.push( id );
  }
  graph.feed = feed;


  // Return the removed posts so the engine can decide what to do next.
  return removals;
};




export {
  Feed
}