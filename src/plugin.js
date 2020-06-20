/* eslint-disable unicorn/no-fn-reference-in-iterator */
const debug = require('debug')('Uttori.SearchProvider.Lunr.Plugin');
const SearchProvider = require('./search-lunr');

/**
 * Uttori Search Provider - Lunr, Uttori Plugin Adapter
 *
 * @example <caption>Plugin</caption>
 * const search = Plugin.callback(viewModel, context);
 * @class
 */
class Plugin {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   *
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>Plugin.configKey</caption>
   * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-search-provider-lunr';
  }

  /**
   * The default configuration.
   *
   * @returns {object} The configuration.
   * @example <caption>Plugin.defaultConfig()</caption>
   * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
   * @static
   */
  static defaultConfig() {
    return {
      ignore_slugs: [],
      lunr_locales: [],
      events: {
        search: ['search-query'],
        buildIndex: ['search-add', 'search-rebuild', 'search-remove', 'search-update'],
        getPopularSearchTerms: ['popular-search-terms'],
        validateConfig: ['validate-config'],
      },
    };
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   *
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   * @example <caption>Plugin.register(context)</caption>
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
   * @static
   */
  static async register(context) {
    debug('register');
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }

    const search = new SearchProvider(config);
    await search.buildIndex(context);
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => {
        if (typeof search[method] !== 'function') {
          debug(`Missing function "${method}" for key "${event}"`);
          return;
        }
        context.hooks.on(event, search[method]);
      });
    });
  }
}

module.exports = Plugin;
