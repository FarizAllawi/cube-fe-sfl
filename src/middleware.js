// middleware.js
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";

export const middleware = async (req) => {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
        cookieName: `${process.env.NEXT_PUBLIC_APP_SHORT_NAME}-auth`,
        password: process.env.NEXT_PUBLIC_IRON_SESSION_PASSWORD,
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
          secure: process.env.NEXT_PUBLIC_IRON_SESSION_PASSWORD === "production",
        },
    });
    const { user } = session;

    const { pathname } = req.nextUrl

    console.log(user)

    if (user?.isLogin === true && user?.isLogin !== undefined) {
        
        if (user.defaultPassword === true && pathname !== '/change-password') {
            return NextResponse.redirect(new URL('/change-password', req.url)) 
        }
        else {
            // user logged in and url path login then redirect to homepage
             if (pathname === '/login') {
                 return NextResponse.redirect(new URL('/', req.url)) 
             }
        }
        
         
     }
    else {
        //Logout user
        session.destroy()

        // unauthorized to see pages use application
        if (pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.url)) 
        }    }
    return res;
  };
  
export const config = {
    matcher: [
        '/',
        '/eca/:page*',
        '/kch-office/:page*',
        '/change-password',
        '/login',
    ],
};