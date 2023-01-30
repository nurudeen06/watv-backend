import model from "../../model/index.js";

const register = async (param) => {
var result = [];
var response =  await model.insertDB('users',{
                  email: param.email,
                  first_name: param.firstName,
                  last_name: param.lastName,
                  password: param.password
                })
if(response){
  let insertBalance = await model.insertDB('account',{
                        user_id: response
                      })
  if(insertBalance){
    result = {"success": true, "message": "Registration Success, Kindly log into your account."}
  }else {
    result = {"success": false, "message": "An error occurred, Contact the Admin."};
  }
}else{
  result = {"success": false, "message": "An error occurred, please try again later."};
} 
  return result;
}
export default register;