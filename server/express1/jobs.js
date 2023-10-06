const express=require("express")
const jobRouter=express.Router()

jobRouter.get("/job",(req,res)=>res.send("call /job GET"))

jobRouter.post("/job",(req,res)=>res.send("call /job POST"))
jobRouter.get("/job/longtime",(req,res)=>{
    setTimeout(()=>{
        res.send({code:0,longtime:"ok"})
    },2000)
})
jobRouter.get("/job/react_query",(req,res)=>{
  setTimeout(()=>{
      res.send({code:0,data:"react query1 返回成功"})
  },1000)
})
jobRouter.get("/job/tasks_by_page",(req,res)=>{
    const page=req.query.page
    res.send({code:0,data:`page ${page} data`})
})
jobRouter.get("/job/objdata",(req,res)=>{
    res.send({code:0,data:"this is objdata"})
})
jobRouter.get("/job/bigfile",(req,res)=>{
    let s=""
    for(let i=0;i<2000000;i++){
        s+="hello "+i+Math.random()
    }
    res.send({code:0,data:s})
})


module.exports= jobRouter