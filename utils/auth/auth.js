import jsonwebtoken from 'jsonwebtoken';

const sign = (payload) => {
    var token = jsonwebtoken.sign({ id : payload.id, email : payload.email}, process.env.APP_NAME,{ expiresIn: '24h'});
    //console.log()
    return token;
}
const verify = (payload) => {
    try{
        var verify = jsonwebtoken.verify(payload?.token, process.env.APP_NAME)
        return verify;
    }
    catch(err) {
        //console.log(err)
        return false;
    }
}

const auth = { 
    sign,
    verify
};
export default auth;