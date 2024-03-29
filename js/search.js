var Search = function(options) {

  if (!options.template) {
    options.template = [
        '<li>',
          '<a href="{{url}}" title="{{description}}">{{{title}}}</a>',
          '{{#category}}',
            '<span class="category">{{category}}</span>',
          '{{/category}}',
        '</li>'
      ].join('');
  }

  var docs,
    loaded = false,
    idx = lunr(function () {
      this.field('title', {boost: 10});
      this.field('category', {boost: 3});
      this.field('description');
      this.field('keywords');
      this.field('searchterms');
      this.ref('id');
    });

  // open search.json file and load it to the memory
  var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("GET", options.json, true);
  xhr.onreadystatechange = function() {
    if (xhr.status==200 && xhr.readyState==4) {
      loaded = true;
      try {
        docs = JSON.parse(xhr.responseText);
        for (var i in docs) {
          docs[i].id = i;
          idx.add(docs[i]);
        }
      } catch(err) {
        console.log(err);
      }
    }
  };
  xhr.send();

  if (options.searchInput) {
    options.searchInput.addEventListener('keyup', function() {
      render(search(this.value, options.limit));
    }, false);
  }

  var search = function(value, limit) {
    if (!value) {
      return false;
    }
    limit = limit || 10;
    return idx.search(value).slice(0, limit).map(function(result) {
      return docs[parseInt(result.ref, 10)];
    });
  };

  var searchByTwoTokens = function(value1, value2, limit) {
    if (!value1 && !value2) {
      return false;
    }
    limit = parseInt(limit / 2) || 5;
    var result1 = idx.search(value1).slice(0, limit),
      result2 = idx.search(value2).slice(0, limit);

    return result1.concat(result2).map(function(result) {
      return docs[parseInt(result.ref, 10)];
    });
  };

  var render = function(records) {
    var result = '',
        m1 = '',
        m2 = '';

    if (false !== records) {
      for (var i in records) {
        var li = Mustache.render(options.template, records[i]);
        if (records[i].url.indexOf('/m1/') !== -1) {
          m1 += li;
        } else if (records[i].url.indexOf('/m2/') !== -1) {
          m2 += li;
        } else {
          result += li;
        }
      }

      if (m1) {
        m1 = '<li class="group">Magento 1.x</li><ul>' + m1 + '</ul>';
      }
      if (m2) {
        m2 = '<li class="group">Magento 2.x</li><ul>' + m2 + '</ul>';
      }

      if (!result && !m1 && !m2) {
        result = 'No results found';
      } else {
        result += m1 + m2;
      }

      if (options.resultsContainer.className.indexOf('shown') === -1) {
        options.resultsContainer.className = options.resultsContainer.className + ' shown';
      }
    } else {
      options.resultsContainer.className = options.resultsContainer.className.replace(/ shown/g, '');
    }
    options.resultsContainer.innerHTML = result;
  };

  return {
    search: function(value, limit) {
      var args = arguments;
      if (!loaded) {
        return setTimeout(function() {
          args.callee(value, limit);
        }, 200);
      }
      render(search(value, limit));
    },

    searchByTwoTokens: function(value1, value2, limit) {
      var args = arguments;
      if (!loaded) {
        return setTimeout(function() {
          args.callee(value1, value2, limit);
        }, 200);
      }
      render(searchByTwoTokens(value1, value2, limit));
    }
  };
};
