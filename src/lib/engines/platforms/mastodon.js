import * as linkify from "linkifyjs";
import { Draft, Identity } from "$lib/engines/draft.js";


const Mastodon = {};

Mastodon.limits = {
  characters: 500,
  attachments: 4,

  // From: https://docs.joinmastodon.org/user/posting/#media
  image: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 16000000  // 16 MB
  },

  audio: {
    types: [
      "audio/aac",
      "audio/mpeg",
      "audio/mp4",
      "audio/flac",
      "audio/wav",
      "audio/opus",
      "audio/vorbis",      
      "audio/ogg",
      "audio/3gpp",
    ],
    size: 99000000  // 99 MB
  },

  video: {
    types: [
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ],
    size: 99000000  // 99 MB
  }
};

// This is unrelated to the character length calcluation below.
// This aims to emperically mimic the visual representation of URLs in the
// Mastodon client. They show more characters and remove the scheme.
Mastodon.urlGlamor = ( _url ) => {
  const url = new URL( _url );
  let string = url.host + url.pathname;
  if ( string.length > 30 ) {
    string = string.slice( 0, 30 ) + "…";
  }  
  return string;
};

// From: https://docs.joinmastodon.org/user/posting/
// "All links are counted as 23 characters, no matter how long they actually are"
Mastodon.contentLength = () => {
  const draft = Draft.read();
  if ( draft.content == null ) {
    return 0;
  }

  const links = linkify.find( draft.content, "url" );
  let length = draft.content.length;
  let surplus = 0;
  
  for ( const link of links ) {
    surplus -= 23 - link.href.length;
  }
  
  return length - surplus;
};

Mastodon.buildVisibility = ( draft ) => {
  switch ( draft.options.mastodon.visibility ) {
    case null:
    case "public":
      return "public";
    case "unlisted":
      return "unlisted";
    case "private":
    case "followers only":
      return "private";
    case "direct":
      return "direct"
  }
};

Mastodon.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    visibility: Mastodon.buildVisibility( draft ),
    spoiler: draft.options.mastodon.spoilerText,
    sensitive: draft.options.attachments.sensitive,
    reply
  };
};


const Validate = {};

Validate.image = ( attachment ) => {
  const limits = Mastodon.limits.image

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Mastodon does not accept images of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Mastodon does not accept image files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.audio = ( attachment ) => {
  const limits = Mastodon.limits.audio

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Mastodon does not accept audio of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Mastodon does not accept audio files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.video = ( attachment ) => {
  const limits = Mastodon.limits.video

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Mastodon does not accept video of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Mastodon does not accept video files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};


Mastodon.validateAttachments = ( draft ) => {
  if ( draft.attachments.length > Mastodon.limits.attachments ) {
    Draft.pushAlert(
      `Mastodon does not allow more than ${Mastodon.limits.attachments} attachments per post.`
    );
    return false;
  }

  for ( const attachment of draft.attachments ) {
    const name = attachment.name;
    const category = attachment.type.split( "/" )[0];
    if ( category == null ) {
      Draft.pushAlert(
        `Gobo cannot identify the media type of attachment ${ name }`
      );
      return false; 
    }

    if ( Validate[ category ] == null ) {
      Draft.pushAlert(
        `Mastodon does not support type ${ attachment.type }`
      );
      return false; 
    }

    const isValid = Validate[category]( attachment );
    if ( !isValid ) {
      return false;
    }
  }

  const hasGIF = !!draft.attachments.find( a => a.type === "image/gif" );
  if ( hasGIF && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Mastodon requires that GIF posts have no other attachments.`
    );
    return false;
  }

  const hasAudio = !!draft.attachments.find( a => a.type.startsWith("audio") );
  if ( hasAudio && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Mastodon requires that audio posts have no other attachments.`
    );
    return false;
  }

  const hasVideo = !!draft.attachments.find( a => a.type.startsWith("video") );
  if ( hasVideo && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Mastodon requires that video posts have no other attachments.`
    );
    return false;
  }

  return true;
};

Mastodon.validate = ( draft ) => {
  if ( !Identity.hasMastodon() ) {
    return true;
  }

  if ( Mastodon.contentLength() > Mastodon.limits.characters ) {
    const number = new Intl.NumberFormat().format( Mastodon.limits.characters );
    Draft.pushAlert(
      `Mastodon does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Mastodon does not allow empty post content.`
    );
    return false;
  }

  if ( !Mastodon.validateAttachments( draft )) {
    return false;
  }

  return true;
};


export {
  Mastodon
}