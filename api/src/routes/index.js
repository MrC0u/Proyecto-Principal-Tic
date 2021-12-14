const Router = require('express');
const router = Router();

const { registro, ingreso, usuarios, enviar, consultaTiempoReal, consultaSemanal, configuracion } = require('../controller/index.controller')

router.get('/registro/:user&:pass&:temp',registro);
router.get('/ingreso/:user&:pass',ingreso);
router.get('/usuarios',usuarios);
router.get('/envioDatos/:userid&:dato&:temperatura',enviar);
router.get('/consultaTiempoReal/:userid',consultaTiempoReal);
router.get('/consultaSemanal/:userid',consultaSemanal);
router.get('/configuracion/:userid&:clave&:temperatura',configuracion);

module.exports = router;