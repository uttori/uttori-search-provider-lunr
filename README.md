[![view on npm](http://img.shields.io/npm/v/uttori-search-provider-lunr.svg)](https://www.npmjs.org/package/uttori-search-provider-lunr)
[![npm module downloads](http://img.shields.io/npm/dt/uttori-search-provider-lunr.svg)](https://www.npmjs.org/package/uttori-search-provider-lunr)
[![Build Status](https://travis-ci.org/uttori/uttori-search-provider-lunr.svg?branch=master)](https://travis-ci.org/uttori/uttori-search-provider-lunr)
[![Dependency Status](https://david-dm.org/uttori/uttori-search-provider-lunr.svg)](https://david-dm.org/uttori/uttori-search-provider-lunr)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-search-provider-lunr/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-search-provider-lunr?branch=master)

#  Uttori Search Provider - Lunr
Uttori Search Provider powered by [Lunr.js](https://lunrjs.com/).

## Install

```bash
npm install --save uttori-search-provider-lunr
```

# API Reference

<a name="SearchProvider"></a>

## SearchProvider
Uttori Search Provider powered by Lunr.js.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| searchTerms | <code>Object</code> | The collection of search terms and their counts. |
| index | <code>Object</code> | The Lunr instance. |


* [SearchProvider](#SearchProvider)
    * [new SearchProvider([config])](#new_SearchProvider_new)
    * [.setup([config])](#SearchProvider+setup)
    * [.search(query, [limit])](#SearchProvider+search) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.internalSearch(query, [limit])](#SearchProvider+internalSearch) ⇒ <code>Array.&lt;Object&gt;</code> ℗
    * [.indexAdd([documents])](#SearchProvider+indexAdd)
    * [.indexUpdate([documents])](#SearchProvider+indexUpdate)
    * [.indexRemove([documents])](#SearchProvider+indexRemove)
    * [.updateTermCount(query)](#SearchProvider+updateTermCount)
    * [.getPopularSearchTerms([limit])](#SearchProvider+getPopularSearchTerms) ⇒ <code>Array.&lt;string&gt;</code>
    * [.shouldAugment([query], [fields])](#SearchProvider+shouldAugment) ⇒ <code>boolean</code>

<a name="new_SearchProvider_new"></a>

### new SearchProvider([config])
Creates an instance of SearchProvider.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | Configuration object for the class. |
| [config.lunr_locales] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | A list of locales to add support for from lunr-languages. |

**Example** *(Init SearchProvider)*  
```js
const searchProvider = new SearchProvider();
const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'] });
```
<a name="SearchProvider+setup"></a>

### searchProvider.setup([config])
Setup the search provider by building an index of documents.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | Configuration object for setup. |
| [config.documents] | <code>Array.&lt;UttoriDocument&gt;</code> | <code>[]</code> | An array of documents to be indexed. |

**Example**  
```js
searchProvider.setup({ documents: [{ slug: 'intro', title: 'Intro', content: '...', tags: ['intro'] }] });
```
<a name="SearchProvider+search"></a>

### searchProvider.search(query, [limit]) ⇒ <code>Array.&lt;Object&gt;</code>
External method for searching documents matching the provided query and updates the count for the query used.
Uses the `internalSearch` method internally.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - Returns an array of search results no longer than limit.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| query | <code>string</code> |  | The value to search for. |
| [limit] | <code>number</code> | <code>100</code> | Limit for the number of returned documents. |

**Example**  
```js
searchProvider.search('matching');
➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
```
<a name="SearchProvider+internalSearch"></a>

### searchProvider.internalSearch(query, [limit]) ⇒ <code>Array.&lt;Object&gt;</code> ℗
Searches for documents matching the provided query with Lunr.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - Returns an array of search results no longer than limit.  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| query | <code>string</code> |  | The value to search for. |
| [limit] | <code>number</code> | <code>100</code> | Limit for the number of returned documents. |

<a name="SearchProvider+indexAdd"></a>

### searchProvider.indexAdd([documents])
Unused: Adds documents to the index.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [documents] | <code>Array.&lt;UttoriDocument&gt;</code> | <code>[]</code> | An array of documents to be indexed. |

<a name="SearchProvider+indexUpdate"></a>

### searchProvider.indexUpdate([documents])
Unused: Updates documents in the index.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [documents] | <code>Array.&lt;UttoriDocument&gt;</code> | <code>[]</code> | An array of documents to be indexed. |

<a name="SearchProvider+indexRemove"></a>

### searchProvider.indexRemove([documents])
Unused: Removes documents from the index.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [documents] | <code>Array.&lt;UttoriDocument&gt;</code> | <code>[]</code> | An array of documents to be indexed. |

<a name="SearchProvider+updateTermCount"></a>

### searchProvider.updateTermCount(query)
Updates the search query in the query counts.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The query to increment. |

<a name="SearchProvider+getPopularSearchTerms"></a>

### searchProvider.getPopularSearchTerms([limit]) ⇒ <code>Array.&lt;string&gt;</code>
Returns the most popular search terms.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>Array.&lt;string&gt;</code> - - Returns an array of search results no longer than limit.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limit] | <code>number</code> | <code>10</code> | Limit for the number of returned popular searches. |

**Example**  
```js
searchProvider.getPopularSearchTerms();
➜ ['popular', 'cool', 'helpful']
```
<a name="SearchProvider+shouldAugment"></a>

### searchProvider.shouldAugment([query], [fields]) ⇒ <code>boolean</code>
Determines if a given search query needs to have fields augmented.

**Kind**: instance method of [<code>SearchProvider</code>](#SearchProvider)  
**Returns**: <code>boolean</code> - - Returns true. Lunr does not return all of the required fields for displaing search results.  

| Param | Type | Description |
| --- | --- | --- |
| [query] | <code>string</code> | Unused: the query to check for augmentation. |
| [fields] | <code>Array.&lt;string&gt;</code> | Unused: the fields required to be on the documents. |


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
