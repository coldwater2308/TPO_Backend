const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const auth = async(req, res, next) => {
  
  
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        if(!token)
        throw new Error()
      const data = jwt.verify(token, process.env.JWT_KEY)
        const admin = await Admin.findOne({ _id: data._id})
        
        if (!admin) {
            throw new Error()
        }
        req.admin = admin
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth