'use strict';

var express = require('express');
var controller = require('./detran.controller');

var router = express.Router();

/*
*	m 	   - machine
*	estado - Estado a que este veiculo pertence. 
*			 Se a const 'dnit' vier no lugar do estado, entao o scraper do dnit será utilizado.
*	placa  - placa do veiculo
*	cr - numero do chassi ou renavam
**/
router.get('/:estado/m/:placa/:cr', controller.index);

/*
*   h 	    - human, uma pessoa leu o captcha
*	placa   - placa do veiculo a ser consultado (os demais dados do veiculo foram guardados, 
*			  juntamente com os dados da sessao)
*	captcha - captcha
**/
router.get('/:placa/h/:captcha', controller.retry);

module.exports = router;