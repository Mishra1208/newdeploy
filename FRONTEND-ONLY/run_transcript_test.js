const fs = require('fs');
const path = require('path');
// Since it's an ES module or uses export, let's write it in CommonJS or use an interop
const { parseTranscript } = require('./src/lib/transcript/parseTranscript.cjs');

// Oh wait, Next.js /lib files are usually ES modules. 
// I will just read the HTML and run it here directly to test, then I'll convert the library file to strictly use ES syntax or valid Next.js module syntax.
