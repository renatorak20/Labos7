const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8081;
const mysql = require('promise-mysql');
const path = require('path');
let pool;

initDb = async () => {

    pool= await mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'labos7',
        debug    :  false
    });

}

initDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
    next();
});



const apiRouter = express.Router();

apiRouter.route('/users').get(async function(req, res){

    try {

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT * FROM users');
        conn.release();
        res.json({ rows });

    } catch (e){
        console.log(e);
        return res.json({"code" : 100, "status" : "Error with query"});
    }


}).post(async function(req, res){

    const user = {
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        name: req.body.name
    };

    try {

        let conn = await pool.getConnection();
        let q = await conn.query('INSERT INTO users SET ?', user);
        conn.release();
        res.json({ username: user.username, password: user.password, email: user.email, name: user.name, _id: q.insertId });

    } catch (e){
        console.log(e);
        res.json({ status: 'NOT OK' });
    }



}).put(async function(req, res){

    const user = {
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        name: req.body.name
    };

    console.log(req.body);

    try {

        let conn = await pool.getConnection();
        let q = await conn.query('UPDATE users SET ? WHERE _id = ?', [user,req.body._id]);
        conn.release();
        res.json({ status: 'OK', changedRows:q.changedRows });
        console.log(q);

    } catch (e){
        res.json({ status: 'NOT OK' });
    }

}).delete(async function(req, res){

    res.json({"code" : 101, "status" : "Body in delete request"});

});

apiRouter.route('/users/:_id').get(async function(req, res){

    try {

        let conn = await pool.getConnection();
        console.log(req.params._id);
        let rows = await conn.query('SELECT * FROM users WHERE _id=?',req.params._id);
        conn.release();
        if (rows[0] != undefined) {
            res.json({ status: 'OK', user:rows[0]});
        } else {
            throw "e";
        }

    } catch (e){
        console.log(e);
        return res.json({"code" : 100, "status" : "Error with query"});

    }



}).delete(async function(req, res){

    try {

        let conn = await pool.getConnection();
        let q = await conn.query('DELETE FROM users WHERE _id = ?', req.params._id);
        conn.release();
        res.json({ status: 'OK', affectedRows :q.affectedRows });

    } catch (e){
        res.json({ status: 'NOT OK' });
    }

});

apiRouter.route('/posts').get(async function(req, res){

    try {

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT * FROM posts');
        conn.release();
        res.json({ rows });

    } catch (e){
        console.log(e);
        return res.json({"code" : 100, "status" : "Error with query"});
    }


}).post(async function(req, res){

    const post = {
        userId: req.body.userId,
        timestamp: req.body.timestamp,
        comment: req.body.comment
    };

    try {

        let conn = await pool.getConnection();
        let q = await conn.query('INSERT INTO posts SET ?', post);
        conn.release();
        res.json({ password: post.password, email: post.email, name: post.name, _id: q.insertId });

    } catch (e){
        console.log(e);
        res.json({ status: 'NOT OK' });
    }



}).put(async function(req, res){

    const post = {
        userId: req.body.userId,
        username: req.body.username,
        timestamp: req.body.timestamp,
        comment: req.body.comment
    };
    console.log(post);

    try {

        let conn = await pool.getConnection();
        let q = await conn.query('UPDATE posts SET ? WHERE _id = ?', [post,req.body._id]);
        conn.release();
        res.json({ changedRows:q.changedRows });

    } catch (e){
        res.json({ status: 'NOT OK' });
    }

});

apiRouter.route('/posts/:_id').delete(async function(req, res) {
    try {
        let conn = await pool.getConnection();
        let q = await conn.query('DELETE FROM posts WHERE _id = ?', req.params._id);
        conn.release();
        res.json({ status: 'OK', affectedRows: q.affectedRows });
    } catch (e) {
        console.log(e);
        res.json({ status: 'NOT OK' });
    }
});




app.use('/api', apiRouter);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});


app.listen(port);
console.log('Running on port ' + port);






