import Topic from "@dashkite/reactive/topic";

const topic = Topic.make();
const KeyboardCommands = {};

const matches = {
  "scroll top": (event) => {
    if ( event.metaKey && event.key === "ArrowUp" ) {
      return true;
    }
    if ( event.ctrlKey && event.key === "Home" ) {
      return true;
    }
    return false;
  },

  "scroll bottom": (event) => {
    if ( event.metaKey && event.key === "ArrowDown" ) {
      return true;
    }
    if ( event.ctrlKey && event.key === "End" ) {
      return true;
    }
    return false;
  } 
};

document.addEventListener("keydown", ( event ) => {
  if (matches[ "scroll top" ]( event )) {
    topic.publish({ name: "scroll top" });
  } else if (matches[ "scroll bottom" ]( event )) {
    topic.publish({ name: "scroll bottom" });
  }
});


class ScrollAgent {
  constructor() {
    this.id = crypto.randomUUID();
  }

  static make({ element, channel }) {
    const agent = new ScrollAgent();
    return Object.assign( agent, { element, channel });
  }

  toTop() {
    this.element.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  toBottom() {
    this.element.scrollTo({
      top: this.element.scrollHeight,
      left: 0,
      behavior: "smooth"
    });
  }

  // Run listens to keyboard commands for scroll actions.
  // Loop ends when channel is closed, resolving the promise.

  // Condition allows us to temporarily pause dispatching the events.
  // Ideally, this is more monadic, but we don't have easy event-based access
  // to certain flows, like navigation or the component cycle.
  async run( condition ) {
    condition ??= () => true;

    for await ( const event of this.channel ) {
      if ( !condition( event )) {
        continue;
      }
      

      switch ( event.name ) {
        case "scroll top":
          this.toTop();
          break;
        case "scroll bottom":
          this.toBottom();
          break;
      }
    }
  }
}

KeyboardCommands.subscribe = ( element ) => {
  const channel = topic.subscribe();
  return ScrollAgent.make({ element, channel });    
};

// This also closes the channel for us.
KeyboardCommands.unsubscribe = ( agent ) => {
  topic.unsubscribe( agent.channel );
};

export {
  KeyboardCommands
}
