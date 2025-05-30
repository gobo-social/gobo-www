import { App } from "$lib/engines/app/index.js";
import { Weave } from "$lib/engines/delivery/weave.js";
import { Preview } from "$lib/engines/link-preview.js";
import * as stores from "$lib/stores/delivery.js";
import * as DeliveryHTTP from "$lib/resources/delivery.js";
import * as DeliveryTargetHTTP from "$lib/resources/delivery-target.js";
import { Feed as Weaver } from "$lib/resources/person-delivery-feeds/all.js";
import * as DraftHTTP from "$lib/resources/draft.js";
import * as ProofHTTP from "$lib/resources/proof.js";



// Deliveries have similar needs to the main post feed, so we use similar
// patterns. See lib/engines/feed.js for more background.

let singletonFeed;

const Feed = {};

Feed.make = async ( context = {} ) => {
  return {
    deliveries: [],
    weaver: await Weaver.make(),
    isStopped: false,
  };
};

Feed.write = () => {
  singletonFeed;
};

Feed.read = async () => {
  if ( singletonFeed == null ) {
    singletonFeed = Feed.make();
  }
  return singletonFeed = await singletonFeed;
};

Feed.put = () => {
  stores.feed.put( singletonFeed );
};

Feed.command = ( name ) => {
  stores.command.put({ name });
};

Feed.update = () => {
  Feed.write();
  Feed.put();
};

Feed.load = async () => {
  await Feed.read();
  Feed.update();
};

Feed.halt = () => {
  if ( singletonFeed != null ) {
    singletonFeed.isStopped = true;
  }
};

Feed.clear = async () => {
  // Halt feed weaver pulling before discarding old object.
  Feed.halt();
  singletonFeed = Feed.make();
  singletonFeed = await singletonFeed
};

Feed.refresh = async () => {
  await Feed.clear();
  Feed.command( "refresh" );
};


Feed.next = async () => {
  const feed = await Feed.read();
  return await feed.weaver.next();
};

Feed.pull = async ( count ) => {
  const results = [];
  let current = 0;

  while ( current < count ) {
    if ( Feed.isStopped === true ) {
      return;
    }

    const result = await Feed.next();
    if ( result == null ) {
      // We're at the bottom of the feed.
      // TODO: Responding to this condition would be different for non-time-based feed sorting.
      break;
    
    } else {
      results.push( result );
      current++;
    }
  }
 
  if ( Feed.isStopped === true ) {
    return;
  }
  
  await Deliveries.push( results );
};


const Deliveries = {};

Deliveries.read = async () => {
  const feed = await Feed.read();
  return feed.deliveries;
};

Deliveries.update = async ( deliveries ) => {
  const feed = await Feed.read();
  feed.deliveries = deliveries;
  Feed.update();
};

Deliveries.push = async ( deliveries ) => {
  const feed = await Feed.read();
  feed.deliveries.push( ...deliveries );
  Feed.update();
};




// Special instantiation, when logged in, to pull data and send to listeners.
// This cuts down on requests to the API and manages race conditions.
Feed.startup = async () => {
  if ( await App.hasAccess( "general" )) {
    // Pull down feed data.
    await Feed.refresh();
  }
};

Feed.shutdown = async () => {
  // Halt feed weaver pulling before discarding old object.
  Feed.halt();
  singletonFeed = null;
};

App.registerStartup( Feed.startup );
App.registerShutdown( Feed.shutdown );




class Draft {
  constructor( _, attachments ) {
    this._ = _;
    this.attachments = attachments;
  }

  get id() {
    return this._.id;
  }

  get store() {
    return this._.store;
  }

  static async create( raw ) {
    const { attachments, ...store } = raw;

    for ( const row of store.thread ) {
      for ( const item of row ) {
        item.linkPreview = await Preview.fetch( item.previewURL );
      }
    }

    store.files = [];
    for ( const draftFile of attachments ) {
      store.files.push( draftFile.id );
    }
    
    const kernel = { 
      store,
      state: "drafting"
    };
    
    const draft = await DraftHTTP.create( kernel );
    return new Draft( draft, attachments );
  }

  async upload() {
    for ( const draftFile of this.attachments ) {
      await draftFile.upload();
    }
  }
}


class Proof {
  constructor( _ ) {
    this._ = _;
  }

  get id() {
    return this._.id;
  }

  get files() {
    return this._.files;
  }

  static async create( draft ) {
    const kernel = {};
    kernel.content = draft.store.content;
    kernel.thread = draft.store.thread;
    kernel.title = draft.store.options?.general?.title ?? undefined;
    // kernel.poll = {};
    kernel.files = draft.store.files;
    kernel.state = "pending";

    const proof = await ProofHTTP.create( kernel );
    return new Proof( proof );
  }
}


class DeliveryTarget {
  constructor( _ ) {
    this._ = _;
  }

  get id() {
    return this._.id;
  }

  static async unpublish( target ) {
    return await DeliveryTargetHTTP.unpublish( target );
  } 
}


// We need a full class for the delivery abstract model to support its
// multiplicity on top of its complex internal state and reactivity.

class Delivery {
  constructor( _ ) {
    this._ = _;
  }

  get id() {
    return this._.id;
  }

  static async create( draft ) {
    const proof = await Proof.create( draft );

    const kernel = { 
      draft_id: draft.id,
      proof_id: proof.id
    };

    const delivery = await DeliveryHTTP.create( kernel );
    return new Delivery( delivery );
  }

  static async get( id ) {
    const graph = await DeliveryHTTP.get({ id });
    const weave = await Weave.make( graph );
    return weave.deliveries[ weave.feed[0] ];
  }

  static async unpublish( delivery ) {
    return await DeliveryHTTP.unpublish( delivery );
  } 
}


export {
  Feed,
  Deliveries,
  Draft,
  Delivery,
  DeliveryTarget,
}