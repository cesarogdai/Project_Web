import DBConnection from "./../configs/DBConnection";
import bcrypt from "bcryptjs";

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    // check email is exist or not
    let isEmailExist = await checkExistEmail(data.email);
    if (isEmailExist) {
      reject(
        `El correo"${data.email}" ya se encuentra registrado. Por favor utilice otro.`
      );
    } else {
      // hash password
      let salt = bcrypt.genSaltSync(10);
      let userItem = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: bcrypt.hashSync(data.password, salt),
      };

      //create a new account
      DBConnection.query(
        " INSERT INTO users set ? ",
        userItem,
        function (err, rows) {
          if (err) {
            reject(false);
          }
          resolve("Se ha creado");
        }
      );
    }
  });
};

let checkExistEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      DBConnection.query(
        " SELECT * FROM `users` WHERE `email` = ?  ",
        email,
        function (err, rows) {
          if (err) {
            reject(err);
          }
          if (rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
};
