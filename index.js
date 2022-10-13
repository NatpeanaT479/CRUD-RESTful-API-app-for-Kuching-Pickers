const bcrypt = require("bcryptjs")

async function hashAndSalt(password){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

async function comparePassword(password, hashedPassword){
    return  bcrypt.compare(password, hashedPassword)
}
async function run(){
    const hash =await hashAndSalt("password")
    //
    const resultWithCorrect =await comparePassword("password", hash)
    const resultWithIncorrect = await comparePassword("passwod", hash)
    console.log(`result1: ${resultWithCorrect}, result2: ${resultWithIncorrect}`)
    console.log(hash)
}

run()

