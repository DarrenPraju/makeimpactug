const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;
const commentsFile = path.join(__dirname,"comments.json");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../public")));

function readComments(){
  if(!fs.existsSync(commentsFile)) fs.writeFileSync(commentsFile,"[]");
  return JSON.parse(fs.readFileSync(commentsFile));
}

function saveComments(arr){
  fs.writeFileSync(commentsFile, JSON.stringify(arr,null,2));
}

app.get("/comments", (_,res) => res.json(readComments()));

app.post("/comments",(req,res)=>{
  const { name, comment } = req.body;
  if(!name||!comment) return res.status(400).json({error:"Missing fields"});
  const arr = readComments();
  arr.push({ name, comment, date: new Date().toISOString() });
  saveComments(arr);
  res.json({ success:true });
});

app.post("/donate", async (req,res)=>{
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:[{ price_data:{ currency:"usd", product_data:{ name:"Donation to MakeImpactug" }, unit_amount:500 }, quantity:1 }],
      mode:"payment",
      success_url:`${req.protocol}://${req.get("host")}/success.html`,
      cancel_url:`${req.protocol}://${req.get("host")}/cancel.html`
    });
    res.json({ url: session.url });
  }catch(e){
    res.status(500).json({ error:e.message });
  }
});

app.listen(PORT, ()=>console.log(`🚀 Running on http://localhost:${PORT}`));
