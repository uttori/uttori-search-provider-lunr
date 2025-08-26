export default Plugin;
/**
 * Uttori Search Provider - Lunr, Uttori Plugin Adapter
 * @example
 * ```js
 * const search = Plugin.callback(viewModel, context);
 * ```
 * @class
 */
declare class Plugin {
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
    static get configKey(): string;
    /**
     * The default configuration.
     * @returns {import('./search-lunr.js').StorageProviderConfig} The configuration.
     * @example
     * ```js
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     * ```
     * @static
     */
    static defaultConfig(): import("./search-lunr.js").StorageProviderConfig;
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
    static register(context: import("@uttori/wiki").UttoriContext): Promise<void>;
}
//# sourceMappingURL=plugin.d.ts.map