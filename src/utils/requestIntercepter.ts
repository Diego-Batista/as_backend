import { RequestHandler } from "express";

export const requestIntercepter: RequestHandler = (req, res, next) => {
    // console.log(`- 403 GET /admin/events/123?abg=true {password:12345}`)
    console.log(`- ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`)
    next();
}