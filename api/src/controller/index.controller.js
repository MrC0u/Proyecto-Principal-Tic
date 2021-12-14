const { Pool } = require('pg');

const pool = new Pool({
    user: 'mrcou',
    host: '192.168.100.19',
    database: 'tics',
    password: '12345',
    port: 5432,
});

const registro = async(req, res) => {

    try{
        // Se obtienen los parametros desde el enlace
        const user = req.params.user;
        const pass = req.params.pass;
        const temperatura = req.params.temp;

        const answer = {};
    
        // Query comprobar existencia usuario
        const response = await pool.query('select usuario from usuario where usuario=($1);', [user]);
    
        // Caso usuario existente
        if(response.rows != ''){
            const id = await pool.query('select id from usuario where usuario=($1);', [user]);
    
            answer.registro = false;
            answer.id = id.rows[0].id;
            answer.user = user;
            answer.msg = 'Usuario actualmente ya registrado';
    
            res.status(200).json(answer);
    
        // Caso usuario inexistente
        }else{

            // Se registra en la base de datos
            const response2 = await pool.query('insert into usuario (usuario, clave, temperatura) values ($1,$2,$3);', [user, pass,temperatura]);

            // Se obtiene el id de usuario
            const id = await pool.query('select id from usuario where usuario=($1);', [user]);
            
            // Parametros de retorno json
            answer.registro = true;
            answer.msg = 'Usuario registrado exitosamente';
            answer.id = id.rows[0].id;
            answer.user = user;
    
            res.status(200).json(answer);
    
        }
    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }

};

const ingreso = async(req, res) => {

    try{

        // Se obtienen los parametros desde el enlace
        const user = req.params.user;
        const pass = req.params.pass;

        const answer = {};
    
        // Query comprobar existencia usuario
        const response = await pool.query('select usuario from usuario where usuario=($1);', [user]);
    
        // Caso usuario existente
        if(response.rows != ''){
            
            // Query obtener clave de este usuario
            const response2 = await pool.query('select clave from usuario where usuario=($1);',[user]);
    
            // Compara la clave de la base de datos con la ingresada en la api
            if(response2.rows[0].clave == pass){

                // Se hace una query obteniendo el id y la temperatura del usuario
                const parametros = await pool.query('select id,temperatura from usuario where usuario=($1);', [user]);
    
                // Parametros de retorno json
                answer.id = parametros.rows[0].id;
                answer.temperatura = parametros.rows[0].temperatura;
                answer.log = true;
                answer.msg = 'Logeo Exitoso';
    
                res.status(200).json(answer);
            }else{
                answer.log = false;
                answer.msg = 'Logeo Denegado';
    
                res.status(200).json(answer);
            }
        
        // Caso usuario inexistente
        }else{
            answer.log = false;
            answer.msg = 'Usuario no existe';
            
            res.status(200).json(answer);
        }

    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }

};

const usuarios = async(req, res) => {

    try{
    
    // Query para mostrar todos los usuarios y sus parametros
    const response = await pool.query('select * from usuario;');
    res.status(200).json(response.rows);

    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }


    
};

const enviar = async(req, res) => {

    try{

        // Se obtienen los parametros desde el enlace
        const user_id = req.params.userid;
        const dato = req.params.dato;
        const temp = req.params.temperatura;

        const answer = {};

        // Se obtiene la fecha del momento
        var today = new Date();

        // Se registra en una variable El tiempo en Year-Month-Day y en otra Hours-Minutes-Seconds 
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        // Se juntan ambos para obtener la fecha y hora del momento actual
        var dateTime = date+' '+time;

        // Se obtiene la fecha para 15 minutos atras
        // En caso de que hace 15 minutos atras de un resultado negativo se resta una hora y luego se calcula el resto de los minutos
        if(today.getMinutes()-15 <= 0 ){
            var time_15mins = (today.getHours()-1) + ":" + (60 + (today.getMinutes()-15)) + ":" + today.getSeconds();
        }else{
            var time_15mins = today.getHours() + ":" + (today.getMinutes()-15) + ":" + today.getSeconds();
        }
        // Se Junta ambos para obtener la fecha y hora de hace 15 minutos
        var dateTime_15mins = date+' '+time_15mins;

        // Query para verificar la existencia del usuario
        const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
        
        // Caso usuario existente
        if(user_exist.rows != ''){

            // Query para verificar la existencia de datos para el usuario hace 15 minutos atras o menos
            const response = await pool.query('select * from datos where date >= ($1) and user_id = ($2);', [dateTime_15mins,user_id]);

            // En caso de existir un dato guardado de hace 15 minutos se hace un Update de estos, con:
            // Su nueva temperatura, litros y fecha
            if(response.rows != ''){

                const response2 = await pool.query('update datos set dato = ($1), date = ($2), temperatura = ($3) where date >= ($4) and user_id = ($5) ;', [dato,dateTime,temp,dateTime_15mins,user_id]);
                answer.user_exist = true;
                answer.actualizado = true;
                answer.creado = false;
                answer.msg = 'Datos Actualizados';
                res.status(200).json(answer);
                
            // En caso de no existir un dato guardado de hace 15 minutos se registra uno nuevo en la base de datos    
            }else{
                const response2 = await pool.query('insert into datos(dato,date,user_id,temperatura) values(($1),($2),($3),($4));;', [dato,dateTime,user_id,temp]);
                answer.user_exist = true;
                answer.actualizado = false;
                answer.creado = true;
                answer.msg = 'Datos Creados';
                res.status(200).json(answer);
            }

        // Caso usuario inexistente
        }else{
            answer.msg = 'Usuario no existe';
            answer.user_exist = false;
            answer.actualizado = false;
            answer.creado = false;
            res.status(200).json(answer);
        }

    }catch(error){
        res.status(400).json(error);
    }
};

const consultaTiempoReal = async(req, res) => {

    try{
        // Se obtienen los parametros desde el enlace
        const user_id = req.params.userid;

        const answer = {};
    
         // Se obtiene la fecha del momento
        var today = new Date();

         // Se registra en una variable la fecha actual
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        // Se obtiene la fecha para 15 minutos atras
        // En caso de que hace 15 minutos atras de un resultado negativo se resta una hora y luego se calcula el resto de los minutos
        if(today.getMinutes()-15 <= 0 ){
            var time_15mins = (today.getHours()-1) + ":" + (60 + (today.getMinutes()-15)) + ":" + today.getSeconds();
        }else{
            var time_15mins = today.getHours() + ":" + (today.getMinutes()-15) + ":" + today.getSeconds();
        }

        // Se Junta ambos para obtener la fecha y hora de hace 15 minutos
        var dateTime_15mins = date+' '+time_15mins;
    
        // Consulta para verificar la existencia del usuario
        const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
                
        // Caso de que el usuario exista
        if(user_exist.rows != ''){
            
            // Consulta para verificar la existencia de datos hace 15 mins
            const response = await pool.query('select id,dato,temperatura,user_id,date from datos where date >= ($1) and user_id = ($2);', [dateTime_15mins,user_id]);
            
            // Caso de existir datos
            if(response.rows != ''){
                answer.user_exist = true;
                answer.respuesta = true;
                answer.id = response.rows[0].id;
                answer.dato = response.rows[0].dato;
                answer.temperatura = response.rows[0].temperatura;
                answer.user_id = response.rows[0].user_id;
                answer.date = response.rows[0].date;
                answer.msg = 'Datos encontrados';
                res.status(200).json(answer);
            // Caso de no existir datos
            }else{
                answer.user_exist = true;
                answer.respuesta = false;
                answer.msg = 'Datos no encontrados para 15 minutos atras';
                res.status(200).json(answer);
            }
        
        // Caso usuario inexistente
        }else{
            answer.user_exist = false;
            answer.msg = 'Usuario no existe';
            res.status(200).json(answer);
        }

    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }
    
};

const consultaSemanal = async(req, res) => {

    try{
        // Se obtienen los parametros desde el enlace
        const user_id = req.params.userid;

        const answer = {};
    
        // Se obtiene la fecha del momento
        var today = new Date();
        
        // Se registra en una variable la hora actual
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        // Se obtiene la fecha para una semana atras
        // En caso de que hace 7 dias atras de un resultado negativo se resta un mes y luego se calcula el resto de los dias
        if(today.getDate()-7 <= 0 ){
            var date_semana = today.getFullYear()+'-'+(today.getMonth())+'-'+( 30 + (today.getDate()-7));
        }else{
            var date_semana = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-7);
        }

         // Se Junta ambos para obtener la fecha y hora de hace una semana
        var dateTime_semana = date_semana+' '+time;
    
        // Consulta para verificar la existencia del usuario
        const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
                
        // Caso usuario existente
        if(user_exist.rows != ''){
    
            // Se obtienen todos los registros desde hace una semana
            const response = await pool.query('select id,dato,temperatura,user_id,date from datos where date >= ($1) and user_id = ($2);', [dateTime_semana,user_id]);
            
            // Caso existencia de registros
            if(response.rows != ''){
                answer.sesiones = {};
                /*
                response.rows.forEach(function(element,index){
                    answer.sesiones[index] ={
                        'id': element.id,
                        'dato': element.dato,
                        'temperatura': element.temperatura,
                        'user_id': element.user_id,
                        'date': element.date
                    }
                });
                */
                answer.sesiones = response.rows;
                answer.user_exist = true;
                answer.respuesta = true;
                answer.msg = 'Datos encontrados';
                res.status(200).json(answer);
                
            // Caso inexistencia de registros
            }else{
                answer.user_exist = true;
                answer.respuesta = false;
                answer.msg = 'Datos no encontrados para una semana atras';
                res.status(200).json(answer);
            }
    
        // Caso usuario inexistente
        }else{
            answer.user_exist = false;
            answer.msg = 'Usuario no existe';
            res.status(200).json(answer);
        }

    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }
    
};

const configuracion = async(req, res) => {

    
    try{

        // Se obtienen los parametros desde el enlace
        const user_id = req.params.userid;
        const clave = req.params.clave;
        const temp = req.params.temperatura;

        const answer = {};

        // Query para verificar la existencia del usuario
        const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
            
        // Caso usuario existente
        if(user_exist.rows != ''){
            
            answer.user_exist = true;

            // Query retorna clave y temperatura de usuario
            const user_data = await pool.query('select clave,temperatura from usuario where id=($1);', [user_id]);
            
            // Si la clave de la base de datos es igual a la ingresada en la api se mantiene, en caso contrario, se cambia
            if(user_data.rows[0].clave == clave){
                answer.clave = false;
            }else{
                const response2 = await pool.query('update usuario set clave=($2) where id = ($1)',[user_id,clave]);
                answer.clave = true;
            }

            // Si la temperatura de la base de datos es igual a la ingresada en la api se mantiene, en caso contrario, se cambia
            if(user_data.rows[0].temperatura == temp){
                answer.temperatura = false;
            }else{
                const response2 = await pool.query('update usuario set temperatura=($2) where id = ($1)',[user_id,temp]);
                answer.temperatura = true;
            }

            // Parametros de retorno
            if((answer.temperatura == false) && (answer.clave) == false){
                answer.msg = 'Ningun dato ha sido actualizado';
                res.status(200).json(answer);
            }else{
                answer.msg = 'Datos actualizados';
                res.status(200).json(answer);
            }

        // Caso usuario inexistente
        }else{
            answer.user_exist = false;
            answer.msg = 'Usuario no existe';
            res.status(200).json(answer);
        }

    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }
    
    
};

module.exports = {
    registro,
    ingreso,
    usuarios,
    enviar,
    consultaTiempoReal,
    consultaSemanal,
    configuracion
};