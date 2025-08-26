import SearchProvider from './search-lunr.js';

let debug = (..._) => {};
/* c8 ignore next 2 */
 
try { const { default: d } = await import('debug'); debug = d('Uttori.SearchProvider.Lunr.Plugin'); } catch {}

/**
 * Uttori Search Provider - Lunr, Uttori Plugin Adapter
 * @example
 * ```js
 * const search = Plugin.callback(viewModel, context);
 * ```
 * @class
 */
class Plugin {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   * @type {string}
   * @returns {string} The configuration key.
   * @example
   * ```js
   * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
   * ```
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-search-provider-lunr';
  }

  /**
   * The default configuration.
   * @returns {import('./search-lunr.js').StorageProviderConfig} The configuration.
   * @example
   * ```js
   * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
   * ```
   * @static
   */
  static defaultConfig() {
    return {
      ignoreSlugs: [],
      lunr_locales: [],
      events: {
        search: ['search-query'],
        buildIndex: ['search-rebuild'],
        indexAdd: ['search-add'],
        indexUpdate: ['search-update'],
        indexRemove: ['search-remove'],
        getPopularSearchTerms: ['popular-search-terms'],
        validateConfig: ['validate-config'],
      },
    };
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   * @param {import('@uttori/wiki').UttoriContext} context A Uttori-like context.
   * @example
   * ```js
   * const context = {
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   *   config: {
   *     [Plugin.configKey]: {
   *       ...,
   *       events: {
   *         search: ['search-query'],
   *         buildIndex: ['search-add', 'search-rebuild', 'search-remove', 'search-update'],
   *         getPopularSearchTerms: ['popular-search-terms'],
   *         validateConfig: ['validate-config'],
   *       },
   *     },
   *   },
   * };
   * Plugin.register(context);
   * ```
   * @static
   */
  static async register(context) {
    debug('register');
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    /** @type {import('./search-lunr.js').StorageProviderConfig} */
    const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }

    const search = new SearchProvider(config);
    await search.buildIndex(context);
    for (const [method, eventNames] of Object.entries(config.events)) {
      if (typeof search[method] === 'function') {
        for (const event of eventNames) {
          context.hooks.on(event, search[method]);
        }
      } else {
        debug(`Missing function "${method}"`);
      }
    }
  }
}

export default Plugin;
