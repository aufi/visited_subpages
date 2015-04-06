//JS

function load_history(search_text, actual_url) {
  var results_div = document.getElementById('results');
  var base_url_span = document.getElementById('base_url');
  base_url_span.innerHTML = search_text;

  chrome.history.search({text: search_text, startTime: 0}, function(entries){
    results_div.innerHTML = '';
    entries.forEach(function(entry){
      if (entry.url === actual_url) return;

      var entry_html = document.createElement('p');

      entry_html.innerHTML = '<a href="' + entry.url + '"><strong>' + entry.title +
      '</strong> <span class="preview_url">' + entry.url + '</span></a>';

      results_div.appendChild(entry_html);
      create_click_bindings();
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
