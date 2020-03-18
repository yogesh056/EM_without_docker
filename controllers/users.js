const models = require('../models')
const moment = require("moment");
// const jwt = require("../services/jwt");
const bcrypt = require("bcryptjs-then");
const Mail = require("../services/mail");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'gmail',
  auth: {
    user: 'astute.event.horizon@gmail.com',
    pass: 'Astute.Event.Horizon123'
  }
});
class UsersController {
  // Create User
  signin(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          email,
          first_name,
          last_name,
          user_name,
          password,
          secretKey,
          phone,
          dob,
         designation,
          gender,
          image
        } = data;
        if (password === "googleLogin") {
          const checkRepeatedUser = await models.User.findOne({ where: { email: email } });
          if (checkRepeatedUser) {
            checkRepeatedUser.destroy()
          }
          const response = await models.User.create({
            first_name: first_name,
            last_name: last_name,
            user_name: user_name,
            image: image,
            password: password,
            email: email,
            phone: phone,
            dob: dob,
            designation:designation,
            gender: gender
          })
          resolve({
            code: 200,
            msg: "User Created Successfully",
            user_id: response['dataValues']['id']
          });
        }
        else {
          const isSecretKeyGenerated = await models.SecretKey.findOne({ where: { Email: email } });
          if (isSecretKeyGenerated) {
            const isValidSecretKey = await models.SecretKey.findOne({ where: { Email: email, secret_key: secretKey } });
            if (isValidSecretKey) {
              const hashedPassword = await bcrypt.hash(password, 10, function (err, hash) {
                return hash
              });
              const response= await models.User.create({
                first_name: first_name,
                last_name: last_name,
                user_name: user_name,
                image: image,
                password: hashedPassword,
                email: email,
                phone: phone,
                dob: moment(dob, "YYYY-MM-DD"),
                designation:designation,
                gender: gender
              })
              console.log("Response",response)
              resolve({ code: 200, msg: "User Created Successfully"  ,user_id:response['dataValues']['id']});
            }
            else {
              resolve({ code: 400, msg: "Not a valid Secret Key" });
            }
          }
        }


      } catch (err) {
        global.log.error(err);
        console.log(err)
        reject(err)
      }
    });
  }
  test() {

    return new Promise(async (resolve, reject) => {
      try {
        resolve({ code: 200, msg: "Tested Successfully" });
      } catch (err) {
        global.log.error(err);
        console.log(err)
        reject(err)
      }
    });
  }
  async verifyEmail(data) {
    try {
      const {
        email,
      } = data;
      console.log(data)
      const response = await models.User.findOne({ where: { email: email } });
      if (response) {
        return Promise.resolve({ code: 400, msg: "User Already Exist" });
      }
      else {
        let secretKey = Math.floor(100000 + Math.random() * 900000)

        const matchUser = await models.SecretKey.findOne({ where: { Email: email } });

        if (matchUser) {
          matchUser.destroy()
        }
        await models.SecretKey.create({ Email: email, secret_key: secretKey })
        this.sendSecretKey(email, secretKey)
        return Promise.resolve({
          code: 200,
          msg: "Please check your mail for the Secret Key"
        });
      }
    } catch (err) {
      console.error(err);
      global.log.error(err);
      return Promise.reject(err);
    }
  }

  async login(data) {
    try {
      const {
        password,
        email
      } = data;

      // If Email or Password Not Given
      console.log("123", data, email, password)
      if (!email || !password) {
        return Promise.resolve({
          code: 404,
          msg: "Please Enter the Credentials Properly"
        });
      }
      const response = await models.User.findOne({ where: { email: email } });

      if (response) {
        const match = await bcrypt.compare(password, response['dataValues']['password'])
        console.log("user",response)
        if (match) {
          return Promise.resolve({
            code: 200,
            msg: "Logged In Successfully",
            id: response['dataValues']['id']
          });
        }
        else {
          return Promise.resolve({ code: 400, msg: "Password incorrect" });
        }
      } else {
        return Promise.resolve({ code: 400, msg: "User does not Exist" });
      }


    } catch (err) {
      console.error(err);
      global.log.error(err);
      return Promise.reject(err);
    }
  }

  async getEvents(data) {
    try {
      const {
        user_id,
      } = data;

      const response = await models.Event.findOne({ where: { UserId: user_id } });

      if (response) {

        return Promise.resolve({ code: 200, msg: "Got all Events", response: response });
      } else {
        return Promise.resolve({ code: 400, msg: "No Events" });
      }


    } catch (err) {
      console.error(err);
      global.log.error(err);
      return Promise.reject(err);
    }
  }
  async getUserDetails(data) {
    try {
      const {
        user_id,
      } = data;

      const response = await models.User.findOne({ where: { id: user_id } });

      if (response) {
        return Promise.resolve({ code: 200, msg: "Welcome Back", response: response });
      } else {
        return Promise.resolve({ code: 400, msg: "No Events" });
      }


    } catch (err) {
      console.error(err);
      global.log.error(err);
      return Promise.reject(err);
    }
  }
  async getAllUsers() {
    try {
      const response = await models.User.findAll({});

      if (response) {
        return Promise.resolve({ code: 200, msg: "Got all Users", response: response });
      } else {
        return Promise.resolve({ code: 400, msg: "No Users" });
      }


    } catch (err) {
      console.error(err);
      global.log.error(err);
      return Promise.reject(err);
    }
  }
  sendSecretKey(email, secretKey) {

    return new Promise(async (resolve, reject) => {
      try {
        console.log("mail callled")



        var mailOptions = {
          from: 'Astute.Event.Horizon@gmail.com',
          to: email,
          subject: 'Secret key Verification',
          text: "hello",
          html: `<body  style="margin-top:0 ;margin-bottom:0 ;margin-right:0 ;margin-left:0 ;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;background-color:#ffffff00;">
          <center style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-image:url(https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80);   background-repeat: no-repeat; background-size: 100% 100%;
          ">
            <div style="max-width:600px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;">
              <table align="center" cellpadding="0" style="border-spacing:0;font-family:'Muli',Arial,sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;">
                <tbody>
                  <tr>
                    <td align="center" class="vervelogoplaceholder" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;vertical-align:middle;" valign="middle"><span><a href="#" target="_blank"><img style="width: 50%;
                      padding: 2%;" alt="Rida Logo" src="https://occ.edu/assets/uploads/images/_small/The_Event_Card_Website_PNG.png" ></a></span></td>
                  </tr>
                  <tr>
                    <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#ffffff;border-radius: 20px;
                    ">
                      <table style="border-spacing:0;" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" class="inner" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;" valign="middle"><span><img alt="Forgot Password" class="banner" height="93" style="height: 45%;" src="https://static.lingoapp.com/assets/images/email/il-password-reset@2x.png" ></span></td>
                          </tr>
                          <tr>
                            <td class="inner contents center" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;text-align:left;">
                              <center>
                                <p class="h1 center" style="Margin:0;text-align:center;font-weight:100;font-size:30px;Margin-bottom:26px;">Here is your Secret Key</p>
        
                                <p class="description center" style="text-align:center;max-width:320px;color:#a1a8ad;line-height:24px;font-size:15px;Margin-bottom:10px;margin-left: auto; margin-right: auto;"><span style="color: rgb(161, 168, 173); font-size: 15px; text-align: center;">${secretKey}</span></p>
                                </center>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                    </td>
                  </tr>
                  <tr>
                      <td height="80">
                        <p style="line-height: 40px; padding: 0 0 0 0; margin: 0 0 0 0;">&nbsp;</p>
          
                        <p>&nbsp;</p>
                      </td>
                    </tr>
                    <tr>
                      <td height="40">
                        <p style="line-height: 40px; padding: 0 0 0 0; margin: 0 0 0 0;">&nbsp;</p>
          
                        <p>&nbsp;</p>
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </center>
        </body>` // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            resolve()
          }
        });

      } catch (err) {
        global.log.error(err);
        reject(err);
      }
    });
  }
}
module.exports = () => {
  return new UsersController()
}
