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
  
    // do anything with session here:
    const { user } = session;
  
    // like mutate user:
    // user.something = someOtherThing;
    // or:
    // session.user = someoneElse;
  
    // uncomment next line to commit changes:
    // await session.save();
    // or maybe you want to destroy session:
    // await session.destroy();
  
    // console.log("from middleware", { user });

    const { pathname } = req.nextUrl

    if (user?.isLogin === true || user?.isLogin !== undefined) {
         // user logged in and url path login then redirect to homepage
         if (user?.isLogin === true && user?.isLogin !== undefined) {
             if (pathname === '/kch-office/login') {
                 return NextResponse.redirect(new URL('/kch-office', req.url)) // redirect to /unauthorized page
             }
         }
    }
    else {
        //Logout user
        await session.destroy()

        // unauthorized to see pages use application
        if (pathname !== '/kch-office/login') {
            return NextResponse.redirect(new URL('/kch-office/login', req.url)) // redirect to /unauthorized page
        }
        
    }
    return res;
  };
  
export const config = {
    matcher: [
        '/kch-office/:page*',
        '/kch-office/login', 
        // '/profile',
        // '/rating',
        // '/notification',
        // '/claims/:path*',
        // '/btb/:path*',
        // '/approval/:path*',
    ],
};