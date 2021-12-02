const { Pool } = require('pg');

const pool = new Pool({
    user: 'mrcou',
    host: '192.168.100.19',
    database: 'tics',
    password: '12345',
    port: 5432,
});

const registro = async(req, res) => {

    const user = req.params.user;
    const pass = req.params.pass;
    const answer = {};
    let exist;

    const response = await pool.query('select usuario from usuario where usuario=($1);', [user]);

    if(response.rows != ''){
        const id = await pool.query('select id from usuario where usuario=($1);', [user]);

        answer.registro = false;
        answer.id = id.rows[0].id;
        answer.user = user;
        answer.msg = 'Usuario actualmente ya registrado';

        res.status(200).json(answer);

    }else{
        const response2 = await pool.query('insert into usuario (usuario, clave) values ($1,$2);', [user, pass]);
        const id = await pool.query('select id from usuario where usuario=($1);', [user]);

        answer.registro = true;
        answer.msg = 'Usuario registrado exitosamente';
        answer.id = id.rows[0].id;
        answer.user = user;

        res.status(200).json(answer);

    }
};

const ingreso = async(req, res) => {

    const user = req.params.user;
    const pass = req.params.pass;
    const answer = {};
    let exist;

    const response = await pool.query('select usuario from usuario where usuario=($1);', [user]);

    if(response.rows != ''){

        const response2 = await pool.query('select clave from usuario where usuario=($1);',[user]);

        if(response2.rows[0].clave == pass){
            const id = await pool.query('select id from usuario where usuario=($1);', [user]);

            answer.id = id.rows[0].id;
            answer.log = true;
            answer.msg = 'Logeo Exitoso';

            res.status(200).json(answer);
        }else{
            answer.log = false;
            answer.msg = 'Logeo Denegado';

            res.status(400).json(answer);
        }

    }else{
        answer.log = false;
        answer.msg = 'Usuario no existe';
        
        res.status(400).json(answer);
    }
};

const usuarios = async(req, res) => {

    const response = await pool.query('select * from usuario;');
    res.status(200).json(response.rows);
    
};

const enviar = async(req, res) => {

    try{

    
        const answer = {};
        const user_id = req.params.userid;
        const dato = req.params.dato;
        const temp = req.params.temperatura;

        if((dato == '') || (temp == '') || (user_id == '') || (dato == null) || (temp == null) || (user_id == null)){
            answer.msg = 'Uno de los parametros es nulos o vacio';
            res.status(400).json(answer);
        }else{

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            if(today.getMinutes()-15 <= 0 ){
                var time_15mins = (today.getHours()-1) + ":" + (60 + (today.getMinutes()-15)) + ":" + today.getSeconds();
            }else{
                var time_15mins = today.getHours() + ":" + (today.getMinutes()-15) + ":" + today.getSeconds();
            }
            var dateTime_15mins = date+' '+time_15mins;

            const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
            
            if(user_exist.rows != ''){

                const response = await pool.query('select * from datos where date >= ($1) and user_id = ($2);', [dateTime_15mins,user_id]);

                if(response.rows != ''){

                    const response2 = await pool.query('update datos set dato = ($1), date = ($2), temperatura = ($3) where date >= ($4) and user_id = ($5) ;', [dato,dateTime,temp,dateTime_15mins,user_id]);
                    answer.user_exist = true;
                    answer.actualizado = true;
                    answer.creado = false;
                    answer.msg = 'Datos Actualizados';
                    res.status(200).json(answer);
                }else{
                    const response2 = await pool.query('insert into datos(dato,date,user_id,temperatura) values(($1),($2),($3),($4));;', [dato,dateTime,user_id,temp]);
                    answer.user_exist = true;
                    answer.actualizado = false;
                    answer.creado = true;
                    answer.msg = 'Datos Creados';
                    res.status(200).json(answer);
                }

            }else{
                answer.msg = 'Usuario no existe';
                answer.user_exist = false;
                answer.actualizado = false;
                answer.creado = false;
                res.status(400).json(answer);
            }

            
        }   
    }catch(error){
        res.status(400).json(error);
    }
};

const consultaTiempoReal = async(req, res) => {

    const answer = {};
    const user_id = req.params.userid;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    if(today.getMinutes()-15 <= 0 ){
        var time_15mins = (today.getHours()-1) + ":" + (60 + (today.getMinutes()-15)) + ":" + today.getSeconds();
    }else{
        var time_15mins = today.getHours() + ":" + (today.getMinutes()-15) + ":" + today.getSeconds();
    }
    var dateTime_15mins = date+' '+time_15mins;

    const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
            
    if(user_exist.rows != ''){

        const response = await pool.query('select id,dato,temperatura,user_id,date from datos where date >= ($1) and user_id = ($2);', [dateTime_15mins,user_id]);
        
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
        }else{
            answer.user_exist = true;
            answer.respuesta = false;
            answer.msg = 'Datos no encontrados para 15 minutos atras';
            res.status(200).json(answer);
        }

    }else{
        answer.user_exist = false;
        answer.msg = 'Usuario no existe';
        res.status(400).json(answer);
    }
    
};

const consultaSemanal = async(req, res) => {

    const answer = {};
    const user_id = req.params.userid;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    if(today.getDate()-7 <= 0 ){
        var date_semana = today.getFullYear()+'-'+(today.getMonth())+'-'+( 30 + (today.getDate()-7));
    }else{
        var date_semana = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-7);
    }
    var dateTime_semana = date_semana+' '+time;

    const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
            
    if(user_exist.rows != ''){

        const response = await pool.query('select id,dato,temperatura,user_id,date from datos where date >= ($1) and user_id = ($2);', [dateTime_semana,user_id]);
        
        if(response.rows != ''){
            answer.sesiones = {};
            response.rows.forEach(function(element,index){
                answer.sesiones[index] ={
                    'id': element.id,
                    'dato': element.dato,
                    'temperatura': element.temperatura,
                    'user_id': element.user_id,
                    'date': element.date
                }
            });
            answer.user_exist = true;
            answer.respuesta = true;
            answer.msg = 'Datos encontrados';
            res.status(200).json(answer);
        }else{
            answer.user_exist = true;
            answer.respuesta = false;
            answer.msg = 'Datos no encontrados para una semana atras';
            res.status(200).json(answer);
        }

    }else{
        answer.user_exist = false;
        answer.msg = 'Usuario no existe';
        res.status(400).json(answer);
    }
    
};

const configuracion = async(req, res) => {

    const answer = {};
    const user_id = req.params.userid;
    const clave = req.params.clave;
    const temp = req.params.temperatura;

    if((user_id == '') || (clave == '') || (temp == '') || (user_id == null) || (clave == null) || (temp == null)){
        answer.msg = 'Uno de los parametros es nulo o vacio';
        res.status(400).json(answer);
    }else{
        const user_exist = await pool.query('select id from usuario where id=($1);', [user_id]);
            
        if(user_exist.rows != ''){
            
            answer.user_exist = true;

            const user_data = await pool.query('select clave,temperatura from usuario where id=($1);', [user_id]);
            
            if(user_data.rows[0].clave == clave){
                answer.clave = false;
            }else{
                const response2 = await pool.query('update usuario set clave=($2) where id = ($1)',[user_id,clave]);
                answer.clave = true;
            }

            if(user_data.rows[0].temperatura == temp){
                answer.temperatura = false;
            }else{
                const response2 = await pool.query('update usuario set temperatura=($2) where id = ($1)',[user_id,temp]);
                answer.temperatura = true;
            }

            if((answer.temperatura == false) && (answer.clave) == false){
                answer.msg = 'Ningun dato ha sido actualizado';
                res.status(200).json(answer);
            }else{
                answer.msg = 'Datos actualizados';
                res.status(200).json(answer);
            }

            //console.log(user_data.rows[0].clave,user_data.rows[0].temperatura);

        }else{
            answer.user_exist = false;
            answer.msg = 'Usuario no existe';
            res.status(400).json(answer);
        }
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