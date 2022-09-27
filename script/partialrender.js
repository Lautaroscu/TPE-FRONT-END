    "use strict"
    
        document.addEventListener('DOMContentLoaded',function(){
        document.querySelector(".btn_menu").addEventListener("click" , function(){  
        document.querySelector(".navigation").classList.toggle("show") ; 
        }) ;
    
    window["index"].addEventListener("click",(event)=>pull(event));
    window["entrenamientos"].addEventListener("click",(event)=>pull(event));
    window["habitos"].addEventListener("click",(event)=>pull(event));
    traer(index.id);
    seleccionar_tag(index.id) ;
    function pull(event){
        let id = event.target.id;
        seleccionar_tag(id);
        document.title = id;
        traer(id);
        window.history.pushState({id},`${id}`,`/page/${id}`);
    }
    function seleccionar_tag(id){
        document.querySelectorAll(".btn_nav").forEach((item)=> item.classList.remove("seleccionado"));
    document.querySelectorAll("#"+id).forEach((item)=>item.classList.add("seleccionado"));
    }
    async function traer(id){
    
    try{  
        let promesa = await fetch(`${window.location.origin}/${id}.html`);
    if(promesa.ok){
        let contenido= await promesa.text();
            document.querySelector("#article").innerHTML= contenido;
    }
    else{
        document.querySelector("#article").innerHTML= "error en la url";
    }
    if(id == "entrenamientos"){
        
        partial_captcha();
    }
    if(id =="habitos"){
        tabla();
    }
    }
    catch(error){
        console.log(error);
    }
    
    }
    window.addEventListener("popstate",(event)=>{
        let stateid= event.state.id;
        seleccionar_tag(stateid);
        traer(stateid);
        document.title = stateid;
    });
    function partial_captcha(){
        //captcha
        let valor1 = document.getElementById("numero1") ;
        let valor2 = document.getElementById("numero2") ;
        let mensaje = document.getElementById("mensaje") ; 
    

        let num1 = Math.floor(Math.random()*10+(3)) ;
        let num2 = Math.floor(Math.random()*10+(3)) ;
        valor1.innerHTML  = num1 ;
        valor2.innerHTML = num2 ;
        let form = document.querySelector("#formulario") ;
        form.addEventListener("submit" ,confirmar) ;
        function confirmar (e){
            e.preventDefault() ;
            let formulario = new FormData(form) ;
            let usuario = formulario.get('usuario') ;
            console.log(usuario) ;

        if(parseInt(num1 + num2) === Number(usuario)  ) {
            let contador = document.querySelector("#contador");
            
            contador.classList.add('mostrarcontador');
            mensaje.innerHTML = "valido" ;
            cuentaregresiva();
            function cuentaregresiva(){
                let intervalo= setInterval(function(){
                let ncontador= document.querySelector("#ncontador").innerHTML;
                if (ncontador==0){
                    clearInterval(intervalo);
                        form.classList.add('captchaNone');
                        form.reset() ;
                }
                else{
                    ncontador--;
                    document.querySelector("#ncontador").innerHTML=ncontador--;
                }

            }, 1000);
            }
        }

        else if(parseInt(num1 + num2) !== Number(usuario)) {
            mensaje.innerHTML = "por favor , intente nuevamente" ; 
        }
    
        }
        
    }
    function tabla(){
        
        const url = 'https://62b49373da3017eabb0d8683.mockapi.io/api/usuarios' ;
        let form = document.getElementById('formu') ;
        let tbody = document.getElementById('tbody') ;
    async function MostarDatos(){
        try {
            tbody.innerHTML = '' ;  
            let promise = await fetch(url)
            let json = await promise.json() ;
            for(let elem of json){
                let Proteinas = elem.Carne ;
                let Minerales = elem.Verduras ;
                let Carbos = elem.Pastas ;
                let id = elem.id;
                console.log(elem) ;
                
            tbody.innerHTML += 
                                    `<td>${Proteinas}</td> 
                                    <td>${Minerales}</td> 
                                    <td>${Carbos}</td>
                                    <td><button type ='button' data-id=${id} class = btn-eliminar><img src=../imagenes/btndelete.png alt=btn-delete></button><button type ='button'  data-id=${id} class = btn-editar><img src=../imagenes/btneditar.png alt=btn-delete></button></td>
                                    ` 
                                
                            }    ;          
                            document.querySelectorAll('.btn-eliminar').forEach((botoneliminar) =>{
                            botoneliminar.addEventListener('click' , eliminar)     
                                }) ;
                                document.querySelectorAll('.btn-editar').forEach((botoneditar) =>{
                                    botoneditar.addEventListener('click' , editar) 
                                }) ;
        }  catch(error){

        console.log(error);
        }
    }             
                                
    let btn_agregar =  document.querySelector('#btn_agregar');               
        btn_agregar.addEventListener('click' , enviarDatos) ;
    async function enviarDatos(e){
            e.preventDefault() ;
           
            let usuario = new get_input() ;
          
            console.log(usuario)
            try{
                        let promise = await fetch(url , {
                            "method" : "POST" ,
                            "headers" : {"Content-Type":"application/json"} ,
                            "body" : JSON.stringify(usuario) 
                    })
                    if(promise.status == 201){
                        console.log('creadoo!') ;
                    }
                }
                catch(error) {
                    console.log('error') ;
                }
                
                form.reset() ;
                MostarDatos() ;
                
                
        } ;
                            
        let btn_agregar_3 =  document.querySelector('#agregar_x3');               
        btn_agregar_3.addEventListener('click' , enviar_3) ;
    async function enviar_3(e){
        e.preventDefault() ;
       
        for(let i= 1; i<=3;i++){
       
             try{
                 let promise = await fetch(url , {
                "method" : "POST" ,
                "headers" : {"Content-Type":"application/json"} ,
                "body" : JSON.stringify(usuarios) 
                    })
                    if(promise.status == 201){
                        console.log('creadoo!') ;
                    }
                }   
                catch(error) {
                    console.log('error') ;
                }
                form.reset() ;
          
                         }
    MostarDatos() ;
        
       }
    async function eliminar(e){
    e.preventDefault() ;
    let id = this.dataset.id ;
        try {
            
            let promise = await fetch(`${url}/${id}` , {
                "method" : "DELETE" 
            
            })
            if(promise.status == 200){
                tbody.innerHTML = '' ;

                await MostarDatos() ;
                console.log('elimiado!' , id) ;
                
            }

        } catch (error) {
            console.log(error) ;
        
        }   
    }
    async function editar(e) {
        e.preventDefault();
        let id = this.dataset.id;
         get_input() ;
        try {
            let promise = await fetch(`${url}/${id}` , {
                'method' : 'PUT' ,  
                'headers' : {'Content-Type' : 'application/json'} ,
                'body' : JSON.stringify(get_input()) 
            });
            

            if(promise.ok){
                console.log('editado!!' , id) ;
                
                
            }   
                tbody.innerHTML= '' ;
            
                await  MostarDatos() ;
        } catch (error) {
            console.log(error) ;
            
        }
        form.reset() ;
    }
    function get_input() {
        let Carnes = document.getElementById('mes');
        let Verduras = document.getElementById('dia');
        let Pastas = document.getElementById('pais') ;
     
       
    
      let json = {
         "Carne" : Carnes.value,
         "Verduras" : Verduras.value ,
         "Pastas" : Pastas.value
       }
       console.log(json) ;
      
       }
    MostarDatos() ;    
     
   
    }                          

    });