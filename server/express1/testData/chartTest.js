const express=require("express")
const chartDataRouter=express.Router()
const TestMesObjData=require("./chartTestData.js")
chartDataRouter.get("/chart_data",(req,res)=>{
  res.send(JSON.stringify(TestMesObjData.TestMesObjData))
})
module.exports= chartDataRouter