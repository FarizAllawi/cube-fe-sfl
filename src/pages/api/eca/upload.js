// import rateLimit from 'express-rate-limit'
// import slowDown from 'express-slow-down'
import md5 from 'md5'
import nextConnect from "next-connect";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs'
import path from 'path'

// const applyMiddleware = middleware => (request, response) =>
//   new Promise((resolve, reject) => {
//     middleware(request, response, result =>
//       result instanceof Error ? reject(result) : resolve(result)
//     )
//   })

// const getIP = request =>
//   request.ip ||
//   request.headers['x-forwarded-for'] ||
//   request.headers['x-real-ip'] ||
//   request.connection.remoteAddress

// export const getRateLimitMiddlewares = ({
//   limit = 10,
//   windowMs = 60 * 1000,
//   delayAfter = Math.round(10 / 2),
//   delayMs = 500,
// } = {}) => [
//   slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
//   rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
// ]


// async function applyRateLimit(request, response) {
//   await Promise.all(
//     middlewares
//       .map(applyMiddleware)
//       .map(middleware => middleware(request, response))
//   )
// }



// const middlewares = getRateLimitMiddlewares({ limit: 50 }).map(applyMiddleware)
// // export default async function handler(request, response) {
// //     if (request.method === 'POST') {
// //        // console.log(request)
// //        try {
// //             await Promise.all(
                
// //                 middlewares.map(middleware => middleware(request, response))
// //             )
// //       } catch {
// //             return response.status(429).send('Too many requests')
// //       }
// //     }
    
// // }




let filename = uuidv4() + "-" + new Date().getTime()
const getFileName = (file) => {
    console.log(file)
    filename = md5(file.originalname) +
        "." +
        file.originalname.substring(
            file.originalname.lastIndexOf(".") + 1,
            file.originalname.length
        );
    return filename;
};

const setDir = (req, res, next) => {
    
}

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501)
            .json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

// apiRoute.use((req,res,next) => setDir(req, res, next))
apiRoute.post((req, res) => {
    
});

// export default apiRoute;


export default function handler(req, res) {

    if (req.method === 'GET') {
        console.log(" ")
    }

    // if (req.method === "POST") {
    //     // const { uniqueFolder } = req.query
    //     // let dir = ''

    //     // if (uniqueFolder !== undefined) dir = `storage/uploads/${md5(req.query.uniqueFolder)}`
    //     // else dir = `storage/uploads`

    //     // fs.exists(dir, exist => {
    //     //     if (!exist) {
    //     //         return fs.mkdir(dir)
    //     //     }
    //     //     return dir
    //     // })

    //     // const upload = multer({
    //     //     storage: multer.diskStorage({
    //     //         destination: './'+dir,
    //     //         filename: (req, file, cb) => cb(null, getFileName(file)),
    //     //     })
    //     // })
    //     console.log(req.body)

    //     // upload.array("Files", 3)(req, {}, err => {
    //     //     // do error handling here
    //     //     // console.log(req.files) // do something with the files here
    //     // })
    //     res.status(200).json({ data :``})
    // }

}

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
        responseLimit: '*',
        // externalResolver: true,
        // responseLimit: '100mb',
    },
};