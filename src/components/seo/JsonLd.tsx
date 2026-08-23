/**
 * JSON-LD RENDERER
 * ================
 * Emits one <script type="application/ld+json"> per page.
 *
 * The payload is generated from typed config, never from user input, so
 * dangerouslySetInnerHTML is safe here. `<` is still escaped so a stray
 * angle bracket in a description can never terminate the script element.
 */

import React from 'react';

export function JsonLd({ graph }: { graph: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
    />
  );
}
