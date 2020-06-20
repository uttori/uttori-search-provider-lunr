[![view on npm](http://img.shields.io/npm/v/@uttori/search-provider-lunr.svg)](https://www.npmjs.org/package/@uttori/search-provider-lunr)
[![npm module downloads](http://img.shields.io/npm/dt/@uttori/search-provider-lunr.svg)](https://www.npmjs.org/package/@uttori/search-provider-lunr)
[![Build Status](https://travis-ci.org/uttori/uttori-search-provider-lunr.svg?branch=master)](https://travis-ci.org/uttori/uttori-search-provider-lunr)
[![Dependency Status](https://david-dm.org/uttori/uttori-search-provider-lunr.svg)](https://david-dm.org/uttori/uttori-search-provider-lunr)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-search-provider-lunr/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-search-provider-lunr?branch=master)

#  Uttori Search Provider - Lunr
Uttori Search Provider powered by [Lunr.js](https://lunrjs.com/).

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

  // A list of slugs to ignore
  ignore_slugs: [],
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
<dt><a href="#UttoriDocument">UttoriDocument</a></dt>
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
| index | <code>object</code> | The Lunr instance. |


* [SearchProvider](#SearchProvider)
    * [new SearchProvider([config])](#new_SearchProvider_new)
    * _instance_
        * [.validateConfig(config)](#SearchProvider+validateConfig)
        * [.buildIndex(context)](#SearchProvider+buildIndex)
        * [.internalSearch(options, context)](#SearchProvider+internalSearch) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ℗
        * [.search(options, context)](#SearchProvider+search) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
        * [.indexAdd([documents], context)](#SearchProvider+indexAdd)
        * [.indexUpdate([documents], context)](#SearchProvider+indexUpdate)
        * [.indexRemove([documents], context)](#SearchProvider+indexRemove)
        * [.updateTermCount(query)](#SearchProvider+updateTermCount)
        * [.getPopularSearchTerms(options)](#SearchProvider+getPopularSearchTerms) ⇒ <code>Array.&lt;string&gt;</code>
    * _static_
        * [.configKey](#SearchProvider.configKey) ⇒ <code>string</code>

<a name="new_SearchProvider_new"></a>

### new SearchProvider([config])
Creates an instance of SearchProvider.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>object</code> | <code>{}</code> | Configuration object for the class. |
| [config.lunr_locales] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | A list of locales to add support for from lunr-languages. |
| [config.ignore_slugs] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | A list of slugs to not consider when indexing documents. |

**Example** *(Init SearchProvider)*  
```js
const searchProvider = new SearchProvider();
const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'] });
```
<a name="SearchProvider+validateConfig"></a>

### searchProvider.validateConfig(config)
Validates the provided configuration for required entries and types.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |
| config.configKey | <code>object</code> | A configuration object specifically for this plugin. |
| config.configKey.ignore_slugs | <code>Array.&lt;string&gt;</code> | A list of slugs to not consider when indexing documents. |
| config.configKey.lunr_locales | <code>Array.&lt;string&gt;</code> | A list of slugs to not consider when indexing documents. |

<a name="SearchProvider+buildIndex"></a>

### searchProvider.buildIndex(context)
Rebuild the search index of documents.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.events | <code>object</code> | An object whose keys correspong to methods, and contents are events to listen for. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> | A list of slugs to not consider when indexing documents. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.hooks.fetch | <code>function</code> | An event dispatch function that returns an array of results. |

**Example**  
```js
searchProvider.buildIndex(context);
```
<a name="SearchProvider+internalSearch"></a>

### searchProvider.internalSearch(options, context) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> ℗
Searches for documents matching the provided query with Lunr.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - - Returns an array of search results no longer than limit.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | The passed in options. |
| options.query | <code>string</code> |  | The value to search for. |
| [options.limit] | <code>number</code> | <code>100</code> | Limit for the number of returned documents. |
| context | <code>object</code> |  | A Uttori-like context. |
| context.config | <code>object</code> |  | A provided configuration to use. |
| context.config.events | <code>object</code> |  | An object whose keys correspong to methods, and contents are events to listen for. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> |  | A list of slugs to not consider when indexing documents. |
| context.hooks | <code>object</code> |  | An event system / hook system to use. |
| context.hooks.on | <code>function</code> |  | An event registration function. |
| context.hooks.fetch | <code>function</code> |  | An event dispatch function that returns an array of results. |

<a name="SearchProvider+search"></a>

### searchProvider.search(options, context) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
External method for searching documents matching the provided query and updates the count for the query used.
Uses the `internalSearch` method internally.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - - Returns an array of search results no longer than limit.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | The passed in options. |
| options.query | <code>string</code> |  | The value to search for. |
| [options.limit] | <code>number</code> | <code>100</code> | Limit for the number of returned documents. |
| context | <code>object</code> |  | A Uttori-like context. |
| context.config | <code>object</code> |  | A provided configuration to use. |
| context.config.events | <code>object</code> |  | An object whose keys correspong to methods, and contents are events to listen for. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> |  | A list of slugs to not consider when indexing documents. |
| context.hooks | <code>object</code> |  | An event system / hook system to use. |
| context.hooks.on | <code>function</code> |  | An event registration function. |
| context.hooks.fetch | <code>function</code> |  | An event dispatch function that returns an array of results. |

**Example**  
```js
searchProvider.search('matching');
➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
```
<a name="SearchProvider+indexAdd"></a>

### searchProvider.indexAdd([documents], context)
Adds documents to the index.
For this implementation, it is rebuilding the index.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [documents] | [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument) | <code>[]</code> | Unused. An array of documents to be indexed. |
| context | <code>object</code> |  | A Uttori-like context. |
| context.config | <code>object</code> |  | A provided configuration to use. |
| context.config.events | <code>object</code> |  | An object whose keys correspong to methods, and contents are events to listen for. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> |  | A list of slugs to not consider when indexing documents. |
| context.hooks | <code>object</code> |  | An event system / hook system to use. |
| context.hooks.on | <code>function</code> |  | An event registration function. |
| context.hooks.fetch | <code>function</code> |  | An event dispatch function that returns an array of results. |

<a name="SearchProvider+indexUpdate"></a>

### searchProvider.indexUpdate([documents], context)
Updates documents in the index.
For this implementation, it is rebuilding the index.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [documents] | [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument) | <code>[]</code> | Unused. An array of documents to be indexed. |
| context | <code>object</code> |  | A Uttori-like context. |
| context.config | <code>object</code> |  | A provided configuration to use. |
| context.config.events | <code>object</code> |  | An object whose keys correspong to methods, and contents are events to listen for. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> |  | A list of slugs to not consider when indexing documents. |
| context.hooks | <code>object</code> |  | An event system / hook system to use. |
| context.hooks.on | <code>function</code> |  | An event registration function. |
| context.hooks.fetch | <code>function</code> |  | An event dispatch function that returns an array of results. |

<a name="SearchProvider+indexRemove"></a>

### searchProvider.indexRemove([documents], context)
Removes documents from the index.
For this implementation, it is rebuilding the index.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [documents] | [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument) | <code>[]</code> | Unused. An array of documents to be indexed. |
| context | <code>object</code> |  | A Uttori-like context. |
| context.config | <code>object</code> |  | A provided configuration to use. |
| context.config.events | <code>object</code> |  | An object whose keys correspong to methods, and contents are events to listen for. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> |  | A list of slugs to not consider when indexing documents. |
| context.hooks | <code>object</code> |  | An event system / hook system to use. |
| context.hooks.on | <code>function</code> |  | An event registration function. |
| context.hooks.fetch | <code>function</code> |  | An event dispatch function that returns an array of results. |

<a name="SearchProvider+updateTermCount"></a>

### searchProvider.updateTermCount(query)
Updates the search query in the query counts.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The query to increment. |

<a name="SearchProvider+getPopularSearchTerms"></a>

### searchProvider.getPopularSearchTerms(options) ⇒ <code>Array.&lt;string&gt;</code>
Returns the most popular search terms.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Array.&lt;string&gt;</code> - - Returns an array of search results no longer than limit.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The passed in options. |
| options.limit | <code>number</code> | Limit for the number of returned popular searches. |

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
**Example** *(Plugin.configKey)*  
```js
const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
```
<a name="UttoriDocument"></a>

## UttoriDocument
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| slug | <code>string</code> |  | The unique identifier for the document. |
| [title] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The unique identifier for the document. |
| [createDate] | <code>number</code> \| <code>Date</code> |  | The creation date of the document. |
| [updateDate] | <code>number</code> \| <code>Date</code> |  | The last date the document was updated. |
| [tags] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | The unique identifier for the document. |
| [customData] | <code>object</code> | <code>{}</code> | Any extra meta data for the document. |


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
