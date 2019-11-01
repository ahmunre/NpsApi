'use strict'
const API_KEY = 'KUTnM6ifzIauuOp5SvfOvhtPunhsT7rjYskbBlIn';
const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
return queryItems.join('&');
}
function displayResults(responseJson) {
   
 
  $('#results-list').empty();
  
  for(var i = 0; i < responseJson.data.length; i++) {
    const park = responseJson.data[i];
    
  
    console.log(park.addresses);
  $('#results-list').append(function() {
  var resultHtml =  `<li><h3>${park.name}</h3>
    <p>Description: ${responseJson.data[i].description}</p>
    <p>URL: <a href=\"${park.url}\">${park.url}</a></p>`;
    for(var j = 0; j < park.addresses.length; j++) {
      resultHtml += `<p>Address: ${park.addresses[j].city}</p>
      <p>
      ${park.addresses[j].line1}
      ${park.addresses[j].postalCode}</p>`;
    }

      resultHtml += "</li>";
      return resultHtml;
          })
    };
  
  $('#js-results').removeClass('hidden');

}

function getParksInfo(query, maxResults=10) {
  const params = {
    api_key: API_KEY,
    limit: maxResults,
    stateCode: query,
    fields: "addresses"
    
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + '?' + queryString;

  fetch(url)
    .then(response => {
      if(response.ok) {
        return response.json();
    }
    throw new Error(response.statusText)
  })
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
    $('#js-error-message').text(`Something is not quite right: ${err.message}`)
  });

}

function watchForm() {
  $('.EntryForm').submit(function() {
    event.preventDefault();
    const state = $('#state_id').val();
    const maxResults = $('js-max-results').val();
    getParksInfo(state, maxResults);
  });

}

$(watchForm);