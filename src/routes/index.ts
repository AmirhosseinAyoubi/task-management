import {Router} from "express";
import AuthRoutes from "./auth";

const routes=Router()

routes.use('/auth',AuthRoutes)

export default routes