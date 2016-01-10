export function get(req, res, next){
  const sess = req.session
  if(sess.name){
    res.json({
      name: sess.name,
      email: sess.email,
      _id: sess.id
    })
  } else res.sendStatus(404)
}
