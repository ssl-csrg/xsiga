let getQueryParameters = function(str) {
    let tokens = {}
	  return (str || document.location.search)
      .replace(/(^\?)/,'').split("&")
      .map((token) => {
        token = token.split("=")
        tokens[token[0]] = decodeURIComponent(token[1])
        return tokens
      })[0];
  }

console.log(getQueryParameters())
