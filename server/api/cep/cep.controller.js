'use strict';
let Client = require('mariasql');

exports.index = function(req, res) {

    let client = new Client({
      host: '127.0.0.1',
      user: 'root',
      port: '3307',
      password: 'root',
      db: 'cep',
      charset: 'utf8'
    });

    let prep = client.prepare(`select e.endereco_cep, e.endereco_logradouro, b.bairro_descricao, u.uf_sigla 
                          from  endereco e, bairro b, cidade c, uf u 
                          where e.bairro_codigo = b.bairro_codigo 
                          and   b.cidade_codigo = c.cidade_codigo 
                          and   b.cidade_codigo = c.cidade_codigo 
                          and   c.uf_codigo = u.uf_codigo 
                          and   e.endereco_cep = :cep`);
     
    client.query(prep({ cep: req.params.cep }), function(err, rows) {
      if (err)
        res.send(500, err);
      else if (!rows[0])
        res.send(404);
      else
        res.send(200, rows[0]);

      console.log(rows[0]) ;
    });
     
    client.end();
};