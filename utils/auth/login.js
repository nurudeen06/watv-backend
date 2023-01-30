import model from '../../model/index.js';
import auth from './auth.js';

const login = async (param) => {
var result = [];

var user = await model.selectDB('users',{
      id: 'id',
      email: 'email',
      firstName: 'first_name',
      lastName: 'last_name'
    },{email: param.email, password: param.password})
        if(user.success == true){
          if(Array.isArray(user.data) && user?.data?.length == 1 ){
            let token = auth.sign(user.data[0]);
            result = user.data[0];
            result.token = token;
          }else {
            result = {"success": false, "message": "Incorrect Details, please try again later."};
          }
        }else {
          result = {"success": false, "message": "An error occurred, please try again later."};
        }
  return result;
}
export default login;