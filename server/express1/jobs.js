const express=require("express")
const jobRouter=express.Router()

jobRouter.get("/job",(req,res)=>res.send("call /job GET"))

jobRouter.post("/job",(req,res)=>res.send("call /job POST"))

module.exports= jobRouter