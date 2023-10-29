import { getGOBOClient, logout } from "$lib/helpers/account.js";
import { Cache, cache } from "$lib/resources/cache.js";

// The following classes play an HTTP intermediary role. They are focused on
// RESTful composition that stablizes this client's request pattern to the GOBO
// HTTP API while building an integrative layer that provides a unified feed as
// a transparent interface.


class Reader {
  constructor ({ identity, per_page, client, filterEngine }) {
    this.identity = identity;
    this.id = identity.id
    this.per_page = per_page ?? 50;
    this.client = client;
    this.head = null;
    this.tail = null;
    this.queue = [];
    this.unlocksAt = null;
    this.filterEngine = filterEngine;
    this.filterEngine.getRunners();
  }

  static async create ({ identity, per_page, filterEngine }) {
    const client = await getGOBOClient();
    per_page = per_page ?? 50;
    return new Reader({ identity, per_page, client, filterEngine });
  }

  async page () {
    try {
      let graph, weave;
      while ( true ) {
        graph = await this.client.personIdentityFeed.get({ 
          person_id: this.client.id,
          id: this.id,
          per_page: this.per_page,
          start: this.tail
        });
  
        const removals = this.filterEngine.filterPrimary( graph );
        console.log( "filtered graph", graph );
        
        // This logic allows us to continue pulling if everything is filtered.
        // TODO: risk of infinite loop here. I think it's a pretty strong case
        //    for a state machine refactor because we are scrutinizing 
        //    conditionals mid-flow again.
        if ( removals.size > 0 && graph.feed.length === 0 ) {
          this.tail = graph.next;
          continue;
        }

        weave = this.filterEngine.weaveGraph( graph );
        this.filterEngine.filterTraversals( weave );
        
        // Another check after we've applied higher-order filters.
        if ( weave.feed.length === 0 ) {
          this.tail = graph.next;
          continue;
        }

        // If we make it here, we have posts to show.
        break;
      }

      // Store the filtered state in the application cache.
      Cache.mergeWeave( this.identity, weave );

      // Almost done. Place results into outer interface and ready next cycle.
      const feed = [];
      for ( const id of weave.feed ) {
        feed.push( weave.posts[id] );
      }
      this.queue.push( ...feed );
      this.head = this.queue[0]?.published;
      this.tail = graph.next;

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

  static async create ({ identities, filterEngine }) {
    const readers = [];
    for ( const identity of identities ) {
      readers.push( await Reader.create({ identity, filterEngine }) );
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



export {
  Feed
}