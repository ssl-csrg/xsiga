export default {
  log: (string) => {
    console.log('XSIGA :: '+string)
  },

  error: (err) => {
    if(err.message) console.error('XSIGA !! '+message)
    console.error('XSIGA !! '+err)
  }
}
