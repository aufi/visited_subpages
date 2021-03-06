//JS

function load_history(search_text, actual_url) {
  var results_div = document.getElementById('results');
  var base_url_span = document.getElementById('base_url');
  var pages_count_span = document.getElementById('pages_count');
  base_url_span.innerHTML = search_text;

  chrome.history.search({text: search_text, startTime: 0}, function(entries){
    results_div.innerHTML = '';
    if (entries.length > 90) {
      pages_count_span.innerHTML = 'Many';
    } else {
      pages_count_span.innerHTML = entries.length - 1;
    }

    entries.forEach(function(entry, index, array) {
      if (entry.url === actual_url) return;

      var entry_html = document.createElement('p');

      title = entry.title == '' ? 'no title' : entry.title;

      entry_html.innerHTML = '<a href="' + entry.url + '"><strong>' + title +
      '</strong><br><span class="preview_url">' + entry.url + '</span></a>';

      results_div.appendChild(entry_html);
      if (index === array.length - 1) {
        create_click_bindings();
      }
    });
    if (results_div.innerHTML === '') results_div.innerHTML = '<p>No pages found.</p>';
  });
}

function create_click_bindings() {
  var elements = document.querySelectorAll('a');
  Array.prototype.slice.call(elements).forEach(function(link) {
    link.addEventListener('click', function(ev) {
      chrome.tabs.create({url: this.href});
    }, false);
  });
}

function get_base_url(current_url) {
  var link = document.createElement('a');
  link.style.display = 'none';
  link.href = current_url;
  document.body.appendChild(link);
  var base_url =  link.protocol + '//' + link.hostname;
  document.body.removeChild(link);
  return base_url;
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.getSelected(null, function(tab){
    load_history(get_base_url(tab.url), tab.url);
  });
});
