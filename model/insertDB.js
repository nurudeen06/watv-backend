import db from "../config/database.js";

const insertDB = async (table, payload) => {
    var result;
     await db(table)
       .insert(payload)
       .then((users)=>{
            result = users[0];
       })
       .catch((err) => {
            result = false;
       })
    return result;
}
export default insertDB;