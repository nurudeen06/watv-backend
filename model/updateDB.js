import { response } from "express";
import db from "../config/database.js";

const updateDB = async (table,payload,arg) => {
await db(table)
    .update(payload)
    .where(arg)
    .then((data) => {
        return true;
    })
    .catch((err) => {
        return false; 
    })
}

export default updateDB;