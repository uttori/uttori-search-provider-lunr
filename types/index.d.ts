declare module "search-lunr" {
    export = SearchProvider;
    class SearchProvider {
        static get configKey(): string;
        constructor(config?: {
            lunr_locales: string[];
            ignore_slugs: string[];
        });
        searchTerms: {};
        index: any;
        config: {
            lunr_locales: any[] | string[];
            ignore_slugs: any[] | string[];
        };
        validateConfig(config: {
            configKey: {
                ignore_slugs: string[];
                lunr_locales: string[];
            };
        }): void;
        buildIndex(context: {
            config: {
                events: object;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): Promise<void>;
        private internalSearch;
        search({ query, limit }: {
            query: string;
            limit: number;
        }, context: {
            config: {
                events: object;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): Promise<object[]>;
        indexAdd(documents?: UttoriDocument[], context: {
            config: {
                events: object;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): void;
        indexUpdate(documents: UttoriDocument[], context: {
            config: {
                events: object;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): void;
        indexRemove(documents: UttoriDocument[], context: {
            config: {
                events: object;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): void;
        updateTermCount(query: string): void;
        getPopularSearchTerms({ limit }: {
            limit: number;
        }): string[];
    }
    namespace SearchProvider {
        export { UttoriDocument };
    }
    type UttoriDocument = {
        slug: string;
        title?: string;
        createDate?: number | Date;
        updateDate?: number | Date;
        tags?: string[];
        customData?: object;
    };
}
declare module "plugin" {
    export = Plugin;
    class Plugin {
        static get configKey(): string;
        static defaultConfig(): object;
        static register(context: {
            config: {
                events: object;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): Promise<void>;
    }
}
declare module "index" {
    export const Plugin: typeof import("plugin");
    export const SearchProvider: typeof import("search-lunr");
}
