export default async function sendEmail (req, res) {
    let nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: `${process.env.NEXT_PUBLIC_SMTP_URL}`,
      // secure: false,
      port: `${process.env.NEXT_PUBLIC_SMTP_PORT}`,
      auth: {
        user: `${process.env.NEXT_PUBLIC_USER_ID}`,
        pass: `${process.env.NEXT_PUBLIC_USER_PW}`,
      }
    
    })
    console.log("CHeck Body")
    console.log(req.body)
    // console.log("CHeck Body")
    const mailData = await {
      from: 'cube@kalbeconsumerhealth.com (CUBE NOTIFICATION)',
      to: `${req.body.email}; andrian.santo@kalbeconsumerhealth.com; yustinus.widya@kalbeconsumerhealth.com; andrian.santo@sakafarma.com`,
      subject: `${req.body.header}`,
      // text: `${req.body.description}` +" | Automatic Sent from: cube@kalbeconsumerhealth.com",
      // html: `<div>${req.body.description}</div><p>cube@kalbeconsumerhealth.com</p>`
      text: `${req.body.description}` +" | Automatic Sent from: Cube Apps",
      html: `<div>${req.body.description} | Automatic Sent from: Cube Apps</div>`
    }
    await transporter.sendMail(mailData, function (err, info) {
      if(err){
        console.log(err)
        res.status(400)
        res.end("Failed")
      }
      else{
        console.log(info)
        res.status(200)
        res.end("Success")
      }
    })
    res.status(200)
    res.end("Success")
  }
