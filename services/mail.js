//const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   pool: true,
//   service: 'gmail',
//   auth: {
//     user: 'yogeshwaran056@gmail.com',
//     pass: '239560Yogesh'
//   }
// });

module.exports = class Mail {
  sendSecretKey(data) {
     
    return new Promise(async (resolve, reject) => {
      try {
        console.log("mail callled")
        // const {
        //     email,
        //   secretKey
        //   // email
        // } = data;
        // secretKey="452490"

        // const info = await transporter.sendMail({
        //   from:'EM', // sender address
        //   to: email, // list of receivers
        //   subject: "Verify Mail", // Subject line
        //   text: "Hello world?", // plain text body
        //   html: `<body  style="margin-top:0 ;margin-bottom:0 ;margin-right:0 ;margin-left:0 ;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;background-color:#ffffff00;">
        //   <center style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-image:url(https://i.imgur.com/wf1ARGb.jpg);   background-repeat: no-repeat; background-size: 100% 100%;
        //   ">
        //     <div style="max-width:600px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;">
        //       <table align="center" cellpadding="0" style="border-spacing:0;font-family:'Muli',Arial,sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;">
        //         <tbody>
        //           <tr>
        //             <td align="center" class="vervelogoplaceholder" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;vertical-align:middle;" valign="middle"><span><a href="#" target="_blank"><img style="width: 50%;
        //               padding: 2%;" alt="Rida Logo" src="http://www.ridaint.com/wp-content/uploads/2017/10/logo-web-1.png" ></a></span></td>
        //           </tr>
        //           <tr>
        //             <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#ffffff;border-radius: 20px;
        //             ">
        //               <table style="border-spacing:0;" width="100%">
        //                 <tbody>
        //                   <tr>
        //                     <td align="center" class="inner" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;" valign="middle"><span><img alt="Forgot Password" class="banner" height="93" style="height: 45%;" src="https://static.lingoapp.com/assets/images/email/il-password-reset@2x.png" ></span></td>
        //                   </tr>
        //                   <tr>
        //                     <td class="inner contents center" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;text-align:left;">
        //                       <center>
        //                         <p class="h1 center" style="Margin:0;text-align:center;font-weight:100;font-size:30px;Margin-bottom:26px;">Forgot your password?</p>
        
        //                         <p class="description center" style="text-align:center;max-width:320px;color:#a1a8ad;line-height:24px;font-size:15px;Margin-bottom:10px;margin-left: auto; margin-right: auto;"><span style="color: rgb(161, 168, 173); font-size: 15px; text-align: center;">${secretKey}</span></p>
        //                         </center>
        //                     </td>
        //                   </tr>
        //                 </tbody>
        //               </table>
                      
        //             </td>
        //           </tr>
        //           <tr>
        //               <td height="80">
        //                 <p style="line-height: 40px; padding: 0 0 0 0; margin: 0 0 0 0;">&nbsp;</p>
          
        //                 <p>&nbsp;</p>
        //               </td>
        //             </tr>
        //             <tr>
        //               <td height="40">
        //                 <p style="line-height: 40px; padding: 0 0 0 0; margin: 0 0 0 0;">&nbsp;</p>
          
        //                 <p>&nbsp;</p>
        //               </td>
        //             </tr>
        //         </tbody>
        //       </table>
        //     </div>
        //   </center>
        // </body>` // html body
        // });

        // console.log(info);
       // resolve(info);
      } catch (err) {
        global.log.error(err);
        reject(err);
      }
    });
  }
};
