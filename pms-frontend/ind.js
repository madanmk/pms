let allproducts=[];
//to fetch data from server and after the request operation(delete,put,post) perfomed.
function getData()
{
    fetch("http://localhost:8000/products")
    .then((res)=>res.json())
    .then((products)=>{
        allproducts=products;
        displayProducts(allproducts);
    })
    .catch((err)=>{
        console.log(err);
    })

}

//to display product 
//inner html using

function displayProducts(products)
{
    document.getElementById("prod").innerHTML=""; 

        products.forEach((p,i)=>{
              
                let tr=document.createElement("tr");

                let noTd=document.createElement("td");
                noTd.append(i+1);
                tr.appendChild(noTd);

                let nameTd=document.createElement("td");
                nameTd.append(p.name);
                tr.appendChild(nameTd);

                let priceTd=document.createElement("td");
                priceTd.append(p.price);
                tr.appendChild(priceTd);

                let quanTd=document.createElement("td");
                quanTd.append(p.quantity);
                tr.appendChild(quanTd);

                let actionsTd=document.createElement("td");

                let updIcon=document.createElement("i");
                updIcon.className="icon fa-solid fa-file-pen text-success";
                updIcon.addEventListener("click",function(){
                    setUpdate(p.id);
                })
                actionsTd.appendChild(updIcon);

                let delIcon=document.createElement("i");
                delIcon.className="icon fa-solid fa-trash text-danger";
                delIcon.addEventListener("click",function(){
                    deleteProduct(p.id);
                })
                actionsTd.appendChild(delIcon);

                tr.appendChild(actionsTd);

                document.getElementById("prod").appendChild(tr);


           })
    
    }

//initial calls
getData();

//function to delete product
function deleteProduct(id){
     
    fetch("http://localhost:8000/products?id="+id,{
        method:"DELETE"
    })
    .then((res)=>res.json())
    .then((message)=>{
          
           if(message.success===true)
           {
          //to delete the data in the front end screen,array and to display the new records.
            let index=allproducts.findIndex((p,i)=>{
                return Number(p.id)===Number(id);
            })

            allproducts.splice(index,1);
           
            displayProducts(allproducts);
        }
        else{
            console.log(message);
        }

      })
      .catch((err)=>{ //handles only server crashed(promise rejection of fetch)not others like own issuses(invalid url,id etc) .
        console.log(err);
      })

}

//function to add product
function addProduct()
{
    //create a object and store the form field data in it and later send it to server.
    let product={};
    product.id=document.getElementById("id").value;
    product.name=document.getElementById("name").value;
    product.price=document.getElementById("price").value;
    product.quantity=document.getElementById("quantity").value;

    fetch("http://localhost:8000/products",{
        method:"POST",
        body:JSON.stringify(product),
        headers:{ //when ur passing content-type header in body,internally browser send option(preflight) request first to server,so u need to handle(req.method==="OPTIONS" in server api if block) and once it receives response from server it send later post request.
          "Content-Type":"application/json"
        }
    })
    .then((res)=>res.json())
    .then((msg)=>{
        //push post data to front end array also
        allproducts.push(product);
        displayProducts(allproducts);
    })
    .catch((err)=>{
        console.log(err);
    })

}

//functions to update
let idtoupd=null;

//function to fill the update form field when u click update icon.
function setUpdate(id)
{
    let product=allproducts.find((p,i)=>{
        return Number(p.id)===Number(id);
    })

    idtoupd=product.id;
    document.getElementById("up_id").value=product.id;//fills update form field id value.
    document.getElementById("up_name").value=product.name;
    document.getElementById("up_price").value=product.price;
    document.getElementById("up_quan").value=product.quantity;

}

//function to change the updated value in front screen and front end array,when u click update button.
function updateProduct(){
   //fetch and stores the changed value of updated field in new object.
   let product={};
   product.id=document.getElementById("up_id").value;
   product.name=document.getElementById("up_name").value;
   product.price=document.getElementById("up_price").value;
   product.quantity=document.getElementById("up_quan").value;
   
   fetch("http://localhost:8000/products?id="+idtoupd,{
    method:"PUT",
    body:JSON.stringify(product),
    headers:{ 
      "Content-Type":"application/json"
       }
    })
    .then((res)=>res.json())
    .then((msg)=>{
           if(msg.success===true)
           {
              console.log("task success");
              //to update in front end screen
              let index=allproducts.findIndex((p,i)=>{
                return Number(p.id)===Number(idtoupd);
               })
             allproducts[index]=product;
              displayProducts(allproducts);
           }
           else{
            console.log(msg);
           }
    })
    .catch((err)=>{
       console.log(err);
    })

}