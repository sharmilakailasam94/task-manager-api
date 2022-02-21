module.exports = {
     createTransport() {     // We will mock createTransport function only
        return {            // We must return an object with sendMail property
          async sendMail() {    // sendMail is empty function, uses shorthand
 
            }
        }
    } 
}