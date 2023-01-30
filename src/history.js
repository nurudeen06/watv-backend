import model from "../model/index.js";
const history = async (id) => {
    if(id){
        var response = await model.selectDB('history',{id: id})
        if(response.status == true){
            return response;
        }else{
            return {"success":false, "message": "An Error Occurred ,Please try again"}; 
        }
    }
    return {"success":false, "message": "Unknown User"}; 
}
export default history;