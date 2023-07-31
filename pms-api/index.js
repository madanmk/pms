const fs=require("fs");
const http=require("http");
const url=require("url");

const server=http.createServer((req,res)=>{
    let products=JSON.parse(fs.readFileSync("./products.json",{encoding:"utf-8"}));//coverting json string to js object.
    let parurl=url.parse(req.url,true);
    //to solve cors problem,backend server send headers through response.
    res.writeHead(200,{
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Methods":"DELETE,POST,PUT",
          "Access-Control-Allow-Headers":"*"
    })
    
       if(req.method==="OPTIONS")
          {
              res.end();
         }
       else if(req.method==="GET" && parurl.pathname==="/products"){
      
       let id=parurl.query.id;
       if(id===undefined){
           res.write(JSON.stringify(products));//converting js object/array to json string while responding to client.
           res.end();
       }
       else{
              let prod=products.find((p,i)=>{
              return Number(p.id)===Number(id);
          })

          if(prod!==undefined){
            res.write(JSON.stringify(prod));
            res.end();
          }
          else{
              res.write(JSON.stringify({message:"Invalid Product Id"}));
              res.end();
          }
       }
       
    }
   /* else if(req.method==="GET" && req.url==="/users"){
        res.write("user request incoming");
    }
    else if(req.method==="POST"){
        res.write("post request incoming");
    }*/
    else if(req.method==="DELETE" && parurl.pathname==="/products")
    {
         let id=parurl.query.id;

         if(id!==undefined)
         {
             let indextodel=products.findIndex((p,i)=>{
                return Number(p.id)===Number(id);
             })
             
             if(indextodel!==-1)
             {
             products.splice(indextodel,1);
             //after deleting in array to delete in file permanently we need to change in file also and it is async in nature ,so close the connection using end() for each response.
             fs.writeFile("./products.json",JSON.stringify(products),(err)=>{
                if(err===null)
                {
                    res.write(JSON.stringify({message:"Product Deleted",success:true}));  
                    res.end(); 
                }
                else
                {
                    res.write(JSON.stringify({message:"Some problem in deleting",success:false}));
                    res.end();
                }
               }) 
            }
            else
            {
                res.write(JSON.stringify({message:"Invalid Produc Id",success:false}));
                res.end(); 
            }
         }
         else
         {
            res.write(JSON.stringify({message:"Please Provide a id in URL",success:false}));
            res.end();
         }
    }

    else if(req.method==="POST" && parurl.pathname==="/products")
    {
        let data="";
        req.on("data",(chunck)=>{
            data+=chunck;//it add one chunck of data each time(body data send through request, example curly bracket,id,etc of data are added here).
        })
        //after receiving all data of body end the connection of buffer
        req.on("end",()=>{
            let dataobj=JSON.parse(data);//converting json object to js string.
            products.push(dataobj);
            
            fs.writeFile("./products.json",JSON.stringify(products),(err)=>{
                if(err===null)
                {
                    res.write(JSON.stringify({message:"Product Added",success:true}));  
                    res.end(); 
                }
                else
                {
                    res.write(JSON.stringify({message:"Some problem in Adding",success:false}));
                    res.end();
                }
               }) 

        })

    }

    else if(req.method==="PUT" && parurl.pathname==="/products")
    {
        let id=parurl.query.id;
        if(id!==undefined)
        {

           let data="";
           req.on("data",(chunck)=>{
                data+=chunck;
             })
        //index of Id is fetched to update the property .
           req.on("end",()=>{
              let indextoupd=products.findIndex((p,i)=>{ 
                  return Number(p.id)===Number(id);
              })
             
              if(indextoupd!==-1){
                 products[indextoupd]=JSON.parse(data);
                 
                 fs.writeFile("./products.json",JSON.stringify(products),(err)=>{
                    if(err===null)
                    {
                        res.write(JSON.stringify({message:"Product Updated",success:true}));  
                        res.end(); 
                    }
                    else
                    {
                        res.write(JSON.stringify({message:"Some problem in Updating",success:false}));
                        res.end();
                    }
                   }) 
                }
                else
                {
                    res.write(JSON.stringify({message:"Invalid Produc Id",success:false}));
                     res.end(); 
                }
            
          })
       }
       else
       {
        res.write(JSON.stringify({message:"Please Provide a id in URL",success:false}));
        res.end();
       }

    }

 /*   else{
        res.write(JSON.stringify({message:"Please Provide a Valid URL"}));
        res.end();
    }*/


  })

    server.listen(8000,()=>{
    console.log("Server is up and running");
    })
