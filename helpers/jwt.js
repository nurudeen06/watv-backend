const expressJwt = require('express-jwt');

function authJwt() {
    const secret = 'my-dog-is-nice';
    const api = '/api/v1';
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    })
    .unless({
         path: [
              {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
              {url: /\/api\/v1\/listing/ , methods: ['GET', 'POST', 'OPTIONS'] },
             `${api}/users/login`,
             `${api}/users/register`,
         ]
    })
}

 async function isRevoked(req, payload, done) {
     if(!payload.isAdmin) {
        done(null, true)
    }

    done();
 }



module.exports = authJwt;