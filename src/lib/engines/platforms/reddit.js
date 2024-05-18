import { Draft, Identity } from "$lib/engines/draft.js";


const Reddit = {};

Reddit.limits = {
  characters: 40000,
  attachments: 20,
  image: {
    types: [
      "image/gif",
      "image/heic",
      "image/heif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    size: 20000000  // 20 MB
  },

  video: {
    types: [
      "video/mp4",
      "video/quicktime",
    ],
    size: 20000000  // 20 MB
  }
};

Reddit.contentLength = () => {
  const draft = Draft.read();
  return draft.content?.length ?? 0;
};

Reddit.build = ( draft ) => {
  let reply;
  if ( draft.reply?.data != null ) {
    const id = draft.reply.data.feed[0];
    reply = draft.reply.data.posts.find( p => p.id == id );
  }

  return {
    subreddit: draft.options.reddit.subreddit,
    spoiler: draft.options.reddit.spoiler,
    nsfw: draft.options.attachments.sensitive,
    reply
  };
};


const Validate = {};

Validate.image = ( attachment ) => {
  const limits = Reddit.limits.image

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Reddit does not accept images of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Reddit does not accept image files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};

Validate.video = ( attachment ) => {
  const limits = Reddit.limits.video

  const type = attachment.type;
  if ( !limits.types.includes(type) ) {
    Draft.pushAlert(
      `Reddit does not accept video of type ${ type }`
    );
    return false;
  }
  
  const size = attachment.size;
  if ( size > limits.size ) {
    Draft.pushAlert(
      `Reddit does not accept video files larger than ${filesize( limits.size )}`
    )
    return false;
  }

  return true;
};


Reddit.validateAttachments = ( draft ) => {
  if ( draft.attachments.length > Reddit.limits.attachments ) {
    Draft.pushAlert(
      `Reddit does not allow more than ${Reddit.limits.attachments} attachments per post.`
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
        `Reddit does not support type ${ attachment.type }`
      );
      return false; 
    }

    const isValid = Validate[category]( attachment );
    if ( !isValid ) {
      return false;
    }
  }

  const hasVideo = !!draft.attachments.find( a => a.type.startsWith("video") );
  if ( hasVideo && draft.attachments.length > 1 ) {
    Draft.pushAlert(
      `Reddit requires that video posts have no other attachments.`
    );
    return false;
  }

  return true;
};

Reddit.validate = ( draft ) => {
  if ( !Identity.hasReddit() ) {
    return true;
  }

  if ( Reddit.contentLength() > Reddit.limits.characters ) {
    const number = new Intl.NumberFormat().format( Reddit.limits.characters );
    Draft.pushAlert(
      `Reddit does not accept posts with more than ${ number } characters.`
    );
    return false;
  }

  if ( (draft.content == null) || (draft.content === "") ) {
    Draft.pushAlert(
      `Reddit does not allow empty post content.`
    );
    return false;
  }

  if ( !Reddit.validateAttachments( draft )) {
    return false;
  }

  return true;
};


export {
  Reddit
}