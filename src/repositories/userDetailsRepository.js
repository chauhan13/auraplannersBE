const pool = require("../configuration/connection");

 class userEntity {

    async getUserDetails(email){
        try{
             const result = await pool.query("SELECT * FROM user_entity WHERE email = $1", [email]);
        return result.rows
        }
       catch(err){
        console.log(err)
        throw new Error(err);
       }
    }

    async registerUser(email,hashedPassword){
     await pool.query(
    "INSERT INTO user_entity (email, password) VALUES ($1, $2) RETURNING *",
    [email, hashedPassword]
  );
}
}

module.exports = new userEntity();