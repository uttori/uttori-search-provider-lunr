const R = require('ramda');
const lunr = require('lunr');

class SearchProvider {
  constructor() {
    this.searchTerms = {};
    this.index = null;
    this.documents = [];

    this.setup = this.setup.bind(this);
  }

  setup(uttori) {
    // Additional locale support
    if (uttori.config && uttori.config.lunr_locales.length) {
      require('lunr-languages/lunr.stemmer.support.js')(lunr);
      require('lunr-languages/lunr.multi')(lunr);
      uttori.config.lunr_locales.forEach((locale) => {
        require(`lunr-languages/lunr.${locale}.js`)(lunr);
      });
    }

    const locales = [];
    if (uttori.config && uttori.config.lunr_locales.length) {
      locales.push('en');
      locales.concat(uttori.config.lunr_locales);
    }

    this.documents = uttori.storageProvider.all();
    const { documents } = this;
    this.index = lunr(function lunrSetup() {
      if (locales.length) {
        this.use(lunr.multiLanguage(...locales));
      }

      this.field('title');
      this.field('content');
      this.field('tags', 100);
      this.ref('slug');

      // add documents to the index
      documents.forEach(document => this.add(document));
    });
  }

  search(term) {
    this.updateTermCount(term);
    return this.internalSearch(term);
  }

  internalSearch(term) {
    const results = this.index.search(term) || [];
    if (results.length) {
      return R.reject(R.isNil, results);
    }
    return results;
  }

  relatedDocuments(term) {
    return this.internalSearch(term);
  }

  indexAdd(_document) {
    // this.index.add(document);
  }

  indexUpdate(_document) {
    // this.index.update(document);
  }

  indexRemove(_document) {
    // this.index.remove(document);
  }

  updateTermCount(term) {
    if (!term) return;
    if (this.searchTerms[term]) {
      this.searchTerms[term]++;
    } else {
      this.searchTerms[term] = 1;
    }
  }

  getPopularSearchTerms(count = 10) {
    return R.take(
      count,
      R.sort(
        (a, b) => (this.searchTerms[b] - this.searchTerms[a]),
        R.keys(this.searchTerms),
      ),
    );
  }
}

module.exports = SearchProvider;
