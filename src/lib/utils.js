export function log(string) {
  console.log('XSIGA :: '+string)
}

export function error(err) {
  if(err.message) console.error('XSIGA !! '+message)
  console.error('XSIGA !! '+err)
}

export function stripObject(obj) {
  let rtn = {}
  for(let prop in obj) {
    if(obj.hasOwnProperty(prop) && !(obj[prop] instanceof HTMLElement)) {
      rtn[prop] = obj[prop]
    }
  }
  return rtn
}
