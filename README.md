[![view on npm](https://img.shields.io/npm/v/@uttori/search-provider-lunr.svg)](https://www.npmjs.org/package/@uttori/search-provider-lunr)
[![npm module downloads](https://img.shields.io/npm/dt/@uttori/search-provider-lunr.svg)](https://www.npmjs.org/package/@uttori/search-provider-lunr)
[![Build Status](https://travis-ci.com/uttori/uttori-search-provider-lunr.svg?branch=master)](https://travis-ci.com/uttori/uttori-search-provider-lunr)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-search-provider-lunr/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-search-provider-lunr?branch=master)
[![Tree-Shaking Support](https://badgen.net/bundlephobia/tree-shaking/@uttori/search-provider-lunr)](https://bundlephobia.com/result?p=@uttori/search-provider-lunr)
[![Dependency Count](https://badgen.net/bundlephobia/dependency-count/@uttori/search-provider-lunr)](https://bundlephobia.com/result?p=@uttori/search-provider-lunr)
[![Minified + GZip](https://badgen.net/bundlephobia/minzip/@uttori/search-provider-lunr)](https://bundlephobia.com/result?p=@uttori/search-provider-lunr)
[![Minified](https://badgen.net/bundlephobia/min/@uttori/search-provider-lunr)](https://bundlephobia.com/result?p=@uttori/search-provider-lunr)

#  Uttori Search Provider - Lunr

Uttori Search Provider powered by [Lunr.js](https://lunrjs.com/). It is largely abandoned but still works well.

## Install

```bash
npm install --save @uttori/search-provider-lunr
```

## Config

```js
{
  // Registration Events
  events: {
    search: ['search-query'],
    buildIndex: ['search-rebuild'],
    indexAdd: ['search-add'],
    indexUpdate: ['search-update'],
    indexRemove: ['search-remove'],
    getPopularSearchTerms: ['popular-search-terms'],
    validateConfig: ['validate-config'],
  },

  // A list of locales to add to Lunr
  // https://lunrjs.com/guides/language_support.html
  lunr_locales: [],

  // A list of functions to add to Lunr that correspond to the locales in lunr_locales
  // Example: import localeFr from 'lunr-languages/lunr.fr.js';
  // lunrLocaleFunctions: [localeFr],
  lunrLocaleFunctions: [],

  // A list of slugs to ignore
  ignoreSlugs: [],
}
```

# API Reference

## Classes

<dl>
<dt><a href="#SearchProvider">SearchProvider</a></dt>
<dd><p>Uttori Search Provider powered by Lunr.js.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#StorageProviderConfig">StorageProviderConfig</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#StorageProviderSearchOptions">StorageProviderSearchOptions</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="SearchProvider"></a>

## SearchProvider
Uttori Search Provider powered by Lunr.js.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| searchTerms | <code>object</code> | The collection of search terms and their counts. |
| index | <code>lunr.Index</code> | The Lunr instance. |


* [SearchProvider](#SearchProvider)
    * [new SearchProvider([config])](#new_SearchProvider_new)
    * _instance_
        * [.index](#SearchProvider+index) : <code>lunr.Index</code>
        * [.validateConfig](#SearchProvider+validateConfig)
        * [.setup](#SearchProvider+setup)
        * [.buildIndex](#SearchProvider+buildIndex)
        * [.internalSearch](#SearchProvider+internalSearch) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
        * [.search](#SearchProvider+search) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
        * [.indexAdd](#SearchProvider+indexAdd)
        * [.indexUpdate](#SearchProvider+indexUpdate)
        * [.indexRemove](#SearchProvider+indexRemove)
        * [.updateTermCount](#SearchProvider+updateTermCount)
        * [.getPopularSearchTerms](#SearchProvider+getPopularSearchTerms) ⇒ <code>Array.&lt;string&gt;</code>
    * _static_
        * [.configKey](#SearchProvider.configKey) ⇒ <code>string</code>

<a name="new_SearchProvider_new"></a>

### new SearchProvider([config])
Creates an instance of SearchProvider.


| Param | Type | Description |
| --- | --- | --- |
| [config] | [<code>StorageProviderConfig</code>](#StorageProviderConfig) | Configuration object for the class. |

**Example**  
```js
const searchProvider = new SearchProvider();
const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'], lunrLocaleFunctions: [localeDe, localeFr, localeJp] });
```
<a name="SearchProvider+index"></a>

### searchProvider.index : <code>lunr.Index</code>
**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  
<a name="SearchProvider+validateConfig"></a>

### searchProvider.validateConfig
Validates the provided configuration for required entries and types.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Record.&lt;string, StorageProviderConfig&gt;</code> | A provided configuration to use. |

<a name="SearchProvider+setup"></a>

### searchProvider.setup
Sets up the search provider with any `lunr_locales` supplied.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  
<a name="SearchProvider+buildIndex"></a>

### searchProvider.buildIndex
Rebuild the search index of documents.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>UttoriContext</code> | A Uttori-like context. |

**Example**  
```js
await searchProvider.buildIndex(context);
```
<a name="SearchProvider+internalSearch"></a>

### searchProvider.internalSearch ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Searches for documents matching the provided query with Lunr.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - - Returns an array of search results no longer than limit.  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>StorageProviderSearchOptions</code>](#StorageProviderSearchOptions) | The passed in options. |
| context | <code>UttoriContext</code> | A Uttori-like context. |

<a name="SearchProvider+search"></a>

### searchProvider.search ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
External method for searching documents matching the provided query and updates the count for the query used.
Uses the `internalSearch` method internally.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - - Returns an array of search results no longer than limit.  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>StorageProviderSearchOptions</code>](#StorageProviderSearchOptions) | The passed in options. |
| context | <code>UttoriContext</code> | A Uttori-like context. |

**Example**  
```js
searchProvider.search('matching');
➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
```
<a name="SearchProvider+indexAdd"></a>

### searchProvider.indexAdd
Adds documents to the index.
For this implementation, it is rebuilding the index.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| documents | <code>Array.&lt;UttoriDocument&gt;</code> | Unused. An array of documents to be indexed. |
| context | <code>UttoriContext</code> | A Uttori-like context. |

<a name="SearchProvider+indexUpdate"></a>

### searchProvider.indexUpdate
Updates documents in the index.
For this implementation, it is rebuilding the index.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| documents | <code>Array.&lt;UttoriDocument&gt;</code> | Unused. An array of documents to be indexed. |
| context | <code>UttoriContext</code> | A Uttori-like context. |

<a name="SearchProvider+indexRemove"></a>

### searchProvider.indexRemove
Removes documents from the index.
For this implementation, it is rebuilding the index.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| documents | <code>Array.&lt;UttoriDocument&gt;</code> | Unused. An array of documents to be indexed. |
| context | <code>UttoriContext</code> | A Uttori-like context. |

<a name="SearchProvider+updateTermCount"></a>

### searchProvider.updateTermCount
Updates the search query in the query counts.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The query to increment. |

<a name="SearchProvider+getPopularSearchTerms"></a>

### searchProvider.getPopularSearchTerms ⇒ <code>Array.&lt;string&gt;</code>
Returns the most popular search terms.

**Kind**: instance property of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Array.&lt;string&gt;</code> - Returns an array of search results no longer than limit.  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>StorageProviderSearchOptions</code>](#StorageProviderSearchOptions) | The passed in options. |

**Example**  
```js
searchProvider.getPopularSearchTerms();
➜ ['popular', 'cool', 'helpful']
```
<a name="SearchProvider.configKey"></a>

### SearchProvider.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>string</code> - The configuration key.  
**Example**  
```js
const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
```
<a name="StorageProviderConfig"></a>

## StorageProviderConfig : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [lunr_locales] | <code>Array.&lt;string&gt;</code> | A list of locales to add support for from lunr-languages. |
| [lunrLocaleFunctions] | <code>Array.&lt;LunrLocale&gt;</code> | A list of locales to add support for from lunr-languages. |
| [ignoreSlugs] | <code>Array.&lt;string&gt;</code> | A list of slugs to not consider when indexing documents. |
| [events] | <code>Record.&lt;string, Array.&lt;string&gt;&gt;</code> | The events to listen for. |

<a name="StorageProviderSearchOptions"></a>

## StorageProviderSearchOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The value to search for. |
| [limit] | <code>number</code> | Limit for the number of returned documents. |


* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)
