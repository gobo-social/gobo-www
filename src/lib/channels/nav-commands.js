
const singletonTargets = {};
const NavCommands = {}

const matchesUp = ( event ) => {
  if ( event.type !== "keydown" ) {
    return false;
  }
  if ( event.metaKey && event.key === "ArrowUp" ) {
    return true;
  }
  if ( event.ctrlKey && event.key === "Home" ) {
    return true;
  }
  return false;
};

const matchesDown = ( event ) => {
  if ( event.type !== "keydown" ) {
    return false;
  }
  if ( event.metaKey && event.key === "ArrowDown" ) {
    return true;
  }
  if ( event.ctrlKey && event.key === "End" ) {
    return true;
  }
  return false;
};

document.addEventListener("keydown", ( event ) => {
  if ( matchesUp( event )) {
    for (const target of Object.values(singletonTargets)) {
      target.dispatch( "scroll top" );
    };
  }
  if ( matchesDown( event )) {
    for (const target of Object.values(singletonTargets)) {
      target.dispatch( "scroll bottom" )
    }
  }
});

class LogicalTarget {
  static make({ name }) {
    const target = new LogicalTarget();
    return Object.assign( target, { name });
  }

  constructor() {
    this.id = crypto.randomUUID();
    this.target = new EventTarget();
  }

  dispatch( name ) {
    const event = new CustomEvent( this.name, { detail: { name }});
    this.target.dispatchEvent( event );
  }

  listen( handler ) {
    this.target.addEventListener( this.name, handler );
    this.cleanup = () => {
      this.target.removeEventListener( this.name, handler );
    };
  }
}

NavCommands.listen = ( handler ) => {
  const target = LogicalTarget.make({ name: "nav command" });
  singletonTargets[ target.id ] = target;
  target.listen( handler );
  return target
};

NavCommands.stop = ( target ) => {
  delete singletonTargets[ target.id ];
  target.cleanup?.();
};

export {
  NavCommands
}
