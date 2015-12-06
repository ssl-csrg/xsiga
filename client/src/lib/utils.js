export function getJSON(url){
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = () => {
      if(xhr.status == 200) resolve(JSON.parse(xhr.response))
      else reject(Error(xhr.statusText))
    }
    xhr.onerror = () => {
      reject(Error('Network Error'))
    }
    xhr.send()
  })
}
