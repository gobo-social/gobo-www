import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Command, Plugin } from "@ckeditor/ckeditor5-core";
import DomEventObserver from "@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver";
import { 
  Widget,
  toWidget,
  viewToModelPositionOutsideModelElement
} from "@ckeditor/ckeditor5-widget";

// editor.execute("add-threadpoint", {value: "bluesky"})

const Helpers = {};


class DoubleClickObserver extends DomEventObserver {
	constructor( view ) {
		super( view );
		this.domEventType = "dblclick";
	}

	onDomEvent( domEvent ) {
		this.fire( domEvent.type, domEvent );
	}
}


class AddThreadpointCommand extends Command {
  execute({ value }) {
      const editor = this.editor;
      const selection = editor.model.document.selection;

      editor.model.change( writer => {
          // Create a <threadpoint> element with the "platform" attribute (and all the selection attributes)...
          const threadpoint = writer.createElement( "threadpoint", {
              ...Object.fromEntries( selection.getAttributes() ),
              platform: value
          } );

          // ... and insert it into the document. Put the selection on the inserted element.
          editor.model.insertObject( threadpoint, null, null, { setSelection: "on" } );
      } );
  }

  refresh() {
      const model = this.editor.model;
      const selection = model.document.selection;
      const isAllowed = model.schema.checkChild( selection.focus.parent, "threadpoint" );
      this.isEnabled = isAllowed;
  }
}

class RemoveThreadpointCommand extends Command {
  execute({ target }) {
    this.editor.model.change( writer => {
      writer.remove( target );
    });
  }

  refresh() {
      const model = this.editor.model;
      const selection = model.document.selection;
      const isAllowed = model.schema.checkChild( selection.focus.parent, "threadpoint" );
      this.isEnabled = isAllowed;
  }
}


Helpers.matchThreadpoint = ( editor, target ) => {
  if ( target.hasClass("threadpoint") ) {
    return editor.editing.mapper.toModelElement( target );
  }
  if ( target.parent.hasClass("threadpoint") ) {
    return editor.editing.mapper.toModelElement( target.parent );
  }
  return;
};

export default class ThreadpointEditing extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    this._defineSchema(); 
    this._defineConverters();
    
    this.editor.commands.add( 
      "add-threadpoint",
      new AddThreadpointCommand( this.editor )
    );
    this.editor.commands.add( 
      "remove-threadpoint",
      new RemoveThreadpointCommand( this.editor )
    );

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement( 
        this.editor.model, 
        viewElement => viewElement.hasClass( "threadpoint" ) 
      )
    );

    const editor = this.editor;
    const view = this.editor.editing.view;
    view.addObserver( DoubleClickObserver );    
    this.editor.listenTo( view.document, "dblclick", ( evt, data ) => {
      const match = Helpers.matchThreadpoint( editor, data.target );
      if ( match != null ) {
        editor.execute( "remove-threadpoint", { target: match });
      }
    });

    window.editor = editor;
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( "threadpoint", {
      // Behaves like a self-contained inline object (e.g. an inline image)
      // allowed in places where $text is allowed (e.g. in paragraphs).
      // The inline widget can have the same attributes as text 
      // (for example linkHref, bold).
      inheritAllFrom: "$inlineObject",

      // The widget can have many types, like date, name, surname, etc:
      allowAttributes: [ "platform" ]
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;


    conversion.for( "upcast" ).elementToElement( {
      view: {
        name: "span",
        classes: [ "threadpoint" ]
      },
      model: ( viewElement, { writer } ) => {
        const platform = viewElement.getAttribute( "data-platform" );
        return writer.createElement( "threadpoint", { platform } );
      }
    } );


    conversion.for( "editingDowncast" ).elementToElement( {
      model: "threadpoint",
      view: ( model, { writer } ) => {
        const view = createThreadpointView( model, writer );

        // For edit view only: decorate with platform icon.
        const platform = model.getAttribute( "platform" );
        const icon = writer.createEmptyElement( "sl-icon", {
          src: `/icons/${platform}.svg`,
          class: platform
        });
        writer.insert( writer.createPositionAt( view, 0 ), icon );
        
        // Enable widget handling on an element inside the editing view.
        return toWidget( view, writer );
      }
    } );


    conversion.for( "dataDowncast" ).elementToElement( {
      model: "threadpoint",
      view: ( model, { writer } ) => {
        return createThreadpointView( model, writer );
      }
    });


    // Helper method for both downcast converters.
    function createThreadpointView( model, writer ) {
      const platform = model.getAttribute( "platform" );

      return writer.createContainerElement( "span", {
        class: "threadpoint",
        "data-platform": platform
      });
    }
  }
}



class Threadpoint extends Plugin {
  static get requires() {
    return [ ThreadpointEditing ];
  }
}

export {
  Threadpoint
}