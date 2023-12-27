declare module 'lunr-languages/lunr.multi.js' {
  import * as lunr from 'lunr';
  namespace lunr {
    interface Index {
      multiLanguage: (languages: string[]) => void;
    }
  }

  export default function lunrMulti(lunr: lunr): void;
}

declare module 'lunr-languages/lunr.stemmer.support.js' {
  import * as lunr from 'lunr';
  namespace lunr {
    interface Index {
      stemmerSupport: {
        Among: (s: string, substring_i: number, result: string, method: number) => void;
        SnowballProgram: () => void;
      };
      trimmerSupport: {
        generateTrimmer: (wordCharacters: string) => string;
      }
    }
  }

  export default function stemmerSupport(lunr: lunr): void;
}

declare module 'lunr-languages/lunr.fr.js' {
  import * as lunr from 'lunr';

  export default function fr(lunr: lunr): void;
}
