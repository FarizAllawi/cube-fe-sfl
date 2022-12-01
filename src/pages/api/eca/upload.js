export default function handler(req, res) {

    if (req.method === 'GET') {
        console.log(" ")
    }

}

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
        responseLimit: '*',
        // externalResolver: true,
        // responseLimit: '100mb',
    },
};