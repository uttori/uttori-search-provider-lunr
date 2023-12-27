<a name="Plugin"></a>

## Plugin
Uttori Search Provider - Lunr, Uttori Plugin Adapter

**Kind**: global class  

* [Plugin](#Plugin)
    * [.configKey](#Plugin.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#Plugin.defaultConfig) ⇒ <code>StorageProviderConfig</code>
    * [.register(context)](#Plugin.register)

<a name="Plugin.configKey"></a>

### Plugin.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>string</code> - The configuration key.  
**Example**  
```js
const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
```
<a name="Plugin.defaultConfig"></a>

### Plugin.defaultConfig() ⇒ <code>StorageProviderConfig</code>
The default configuration.

**Kind**: static method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>StorageProviderConfig</code> - The configuration.  
**Example**  
```js
const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
```
<a name="Plugin.register"></a>

### Plugin.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>Plugin</code>](#Plugin)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>UttoriContext</code> | A Uttori-like context. |

**Example**  
```js
const context = {
  hooks: {
    on: (event, callback) => { ... },
  },
  config: {
    [Plugin.configKey]: {
      ...,
      events: {
        search: ['search-query'],
        buildIndex: ['search-add', 'search-rebuild', 'search-remove', 'search-update'],
        getPopularSearchTerms: ['popular-search-terms'],
        validateConfig: ['validate-config'],
      },
    },
  },
};
Plugin.register(context);
```
