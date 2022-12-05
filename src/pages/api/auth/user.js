import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
    function userRoute(req, res) {
        res.send({ data: req.session.user });
    },
    {
        cookieName: `${process.env.NEXT_PUBLIC_APP_SHORT_NAME}-auth`,
        password: process.env.NEXT_PUBLIC_IRON_SESSION_PASSWORD,
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            // secure: process.env.NODE_ENV === "production",
            secure: false,
        },
    },
);