import Markdown from "markdown-it";
import mila from "markdown-it-link-attributes";
import tlds from "tlds";

// This markdown-it instance is configured for internal use so we can prepare
// the main content of documents like terms-of-service as Markdown, then
// seamlessly render the corresponding HTML into the application.
//
// I've purposefully separated this renderer from the one we use for posts.
// As a result, it may be safely altered to suit our needs.

const md = new Markdown({
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     true,        // Use '/' to close single tags (<br />).
  breaks:       false,       // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-', // CSS language prefix for fenced blocks. Can be
                             // useful for external highlighters.
  linkify:      true,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
  typographer:  true,
});

md.linkify.tlds(tlds);

// Ensure any links politely link out to another tab.
md.use( mila, {
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  },
});

const toHTML = ( markdown ) => {
  return md.render( markdown );
};

export { 
  toHTML
}; 