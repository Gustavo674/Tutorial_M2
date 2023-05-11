    const express = require('express'); 
    const bodyParser = require('body-parser');
    const urlencodedParser = bodyParser.urlencoded({ extended: false })

    const sqlite3 = require('sqlite3').verbose();
    const DBPATH = 'NovoBancoDeDados';

    const hostname = '127.0.0.1';
    const port = 3000;
    const app = express();

    /* Colocar toda a parte estática no frontend */
    app.use(express.static("../frontend/"));

    /* Definição dos endpoints */
    /******** CRUD ************/
    app.use(express.json());

    // Retorna todos registros (é o R do CRUD - Read)
    app.get('TblCandidato', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        var db = new sqlite3.Database(DBPATH); // Abre o banco
        var sql = 'SELECT * FROM TblCandidato ORDER BY nome_completo COLLATE NOCASE';
            db.all(sql, [],  (err, rows ) => {
                if (err) {
                    throw err;
                }
                res.json(rows);
            });
            db.close(); // Fecha o banco
    });

    // Insere um registro (é o C do CRUD - Create)
    app.post('/insereCandidato', urlencodedParser, (req, res) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        var db = new sqlite3.Database(DBPATH); // Abre o banco
        sql = "INSERT INTO TblCandidato (nome_completo, email, telefone, endereco) VALUES ('" + req.body.nome + "', '" + req.body.email + "', " + req.body.telefone + ",  " + req.body.endereco + ")";
        console.log(sql);
        db.run(sql, [],  err => {
            if (err) {
                throw err;
            }	
        });
        res.write('<p>USUARIO INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
        db.close(); // Fecha o banco
        res.end();
    });

    // Monta o formulário para o update (é o U do CRUD - Update)
    app.get('/atualizaCandidato', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        sql = "SELECT * FROM TblCandidato WHERE ID_Candidato="+ req.query.userId;
        console.log(sql);
        var db = new sqlite3.Database(DBPATH); // Abre o banco
        db.all(sql, [],  (err, rows ) => {
            if (err) {
                throw err;
            }
            res.json(rows);
        });
        db.close(); // Fecha o banco
    });

    // Atualiza um registro (é o U do CRUD - Update)
    app.post('/atualizaCandidato', urlencodedParser, (req, res) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        sql = "UPDATE TblCandidato SET nome_completo='" + req.body.nome + "', email = '" + req.body.email + "' , telefone='" + req.body.telefone + "'endereco='" + req.body.endereco + "' WHERE ID_Candidato='" + req.body.ID_Candidato + "'";
        console.log(sql);
        var db = new sqlite3.Database(DBPATH); // Abre o banco
        db.run(sql, [],  err => {
            if (err) {
                throw err;
            }
            res.end();
        });
        res.write('<p>CANDIDATO ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
        db.close(); // Fecha o banco
    });

    // Exclui um registro (é o D do CRUD - Delete)
    app.get('/removeCandidato', urlencodedParser, (req, res) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        sql = "DELETE FROM TblCandidato WHERE ID_Candidato='" + req.query.ID_Candidato + "'";
        console.log(sql);
        var db = new sqlite3.Database(DBPATH); // Abre o banco
        db.run(sql, [],  err => {
            if (err) {
                throw err;
            }
            res.write('<p>CANDIDATO REMOVIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
            res.end();
        });
        db.close(); // Fecha o banco
    });

    app.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
    });