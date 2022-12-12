export default async function sendEmail (req, res) {
    let nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host: `${process.env.NEXT_PUBLIC_SMTP_URL}`,
      // secure: false,
      port: `${process.env.NEXT_PUBLIC_SMTP_PORT}`,
      auth: {
        user: "no.reply@kalbeconsumerhealth.com",
        pass: "@Sakafarma22"
      }
    
    })
    // console.log("CHeck Body")
    // console.log(req.body)
    // console.log("CHeck Body")
    const mailData = await {
      from: 'employee.claim@kalbeconsumerhealth.com (no reply)',
      to: req.body.email,
      subject: `${req.body.header}`,
      text: `${req.body.description}` +" | Automatic Sent from: employee.claim@kalbeconsumerhealth",
      html: `<div>${req.body.description}</div><p>employee.claim@kalbeconsumerhealth</p>`
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