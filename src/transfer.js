import model from "../model/index.js";
import db from "../config/database.js";
var payload;
var arg;
const checkReceiver = async (email) => {
    payload = {
        id: 'id'
    }
    arg = {
        email: email 
    }
    var response = await model.selectDB('users',payload, arg);
    if(response?.status == true && Array.isArray(response?.data) && response?.data?.length == 1){
        var getbal = await model.selectDB('account',{
            id:'id',
            balance: 'balance'
        },{id:response.data[0]});
        if(getbal){
            return getbal.data[0];
        }
    }
    return false;
}
const check = async (id, amount, code, email) => {
     payload = {
        id: 'users.id',
        balance :'account.balance'
    }
     arg = {
        'users.id':id,
        'users.trx_code': code
     }
 await db('users')
     .join('account','users.id','account.user_id')
     .select(payload)
     .where(arg)
     .then((data) => {
        if(Array.isArray(data) && data.length == 1){
            if(parseFloat(data[0]?.balance) > parseFloat(amount)){
                var checkR = checkReceiver(email);
                if(checkR){
                    return {"success":true, "data": {"receiver":checkR, "balance": data[0].balance}};
                }else{
                    return {"success":false, "message": "Unknown Receiver ,Please try again"};
                }
            }else{
                return {"success":false, "message": "Low Balance ,Please try again"};
            }
        }else {
            return {"success":false, "message": "Incorrect Pin ,Please try again"};
        }
     })
     .catch((err) => {
        return {"success": false, "message": "An error occurred, please try again later."};
     })
}

const initiate = async (user_id, balance, amount, receiver) => {
    var rBalance = receiver.balance + amount;
    var sBalance = balance - amount;
    try{
       await model.updateDB('account',{"balance": sBalance}, {"id":user_id});
       await model.updateDB('account',{"balance": rBalance}, {"id":receiver.id});
       await model.insertDB('history',{
        user_id: user_id,
        detail: "You transferred "+amount,
        type: "1"
       })
       await model.insertDB('history',{
        user_id: receiver.id,
        detail: "You received "+amount,
        type: "2"
       })

        return true;
    }
    catch {
        return false;
    }
}
const transfer = async (param, payload) => {
    var result, verify = []; 
    verify = await check(payload.id, param.amount, param.code, param.receiver);
    if(verify.status == true){
        try{
            await initiate(payload.id, verify.data.balance, param.amount, verify.data.receiver);
            return {"success":true, "message": "Transfer Completed"}; 
        }
        catch {
            return {"success":false, "message": "An Error Occurred ,Please try again"}; 
        }
    }else{
        return verify; 
    }
}
export default transfer;