 import db from "../config/database.js";

const selectDB = async (table, payload, arg) => {
var response = {};
var query =  db(table)
    await query.select(payload);
    if(arg){
        await query.where(arg);
    }
    await query.then((data)=>{
        response = {"success": true, "data": data};
    })
    await query.catch((err) => {
        response = {"success": false, "message": "An error occurred, please try again later."};
    })
return response;
}
 export default selectDB;