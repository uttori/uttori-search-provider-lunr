/**
 * The document object we store, with only the minimum methods we access listed.
 */
export type UttoriDocument = {
  /**
   * The unique identifier for the document.
   */
  slug: string;
  /**
   * The unique identifier for the document.
   */
  title?: string;
  /**
   * The creation date of the document.
   */
  createDate?: number | Date;
  /**
   * The last date the document was updated.
   */
  updateDate?: number | Date;
  /**
   * The unique identifier for the document.
   */
  tags?: string[];
};

type UttoriPluginConfig = import('./../src/search-lunr.js').StorageProviderConfig
type UttoriContext = {
  config: Record<string, UttoriPluginConfig>;
  hooks: {
      on: (eventLabel: string, callback: Function) => void;
      fetch: (eventLabel: string, query: string) => Promise<UttoriDocument[]>;
  };
}

export type LunrLocale = (lunr: lunr) => void
