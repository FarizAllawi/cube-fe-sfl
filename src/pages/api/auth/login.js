// pages/api/auth/login
import { withIronSessionApiRoute } from "iron-session/next"
export default withIronSessionApiRoute(
  async function loginRoute(req, res) {

    Date.prototype.addDate = function(h){
      this.setDate(this.getDate()+h);
      this.setHours(0)
      this.setMinutes(0)
      this.setSeconds(0)
      return this;
    }
    
    // get new date for next session
    let getDate = new Date().addDate(1);
    
    req.session.user = {
        id: req.body.id,
        nik: req.body.nik,
        name: req.body.name,
        email: req.body.email,
        token: req.body.token,
        expire: getDate,
        isLogin: true,
    };
    await req.session.save();
    res.send({ ok: true });
  },
  {
    cookieName: `${process.env.NEXT_PUBLIC_APP_SHORT_NAME}-auth`,
    password: process.env.NEXT_PUBLIC_IRON_SESSION_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
)