var app = require('express')(),
    mongo = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    currentDb ;

app.listen(80, ()=>{
    console.log('Server is working');
})
//extrating body from request
app.use(bodyParser.urlencoded({extended : true}));
// for using put & delete request for html form
app.use(methodOverride('_method'));

mongo.connect('mongodb://127.0.0.1:27017/', (err, db)=>{
    if (err){
        console.log(err);
        throw err;
    }
    currentDb = db.db('mydb');
    currentDb = currentDb.collection('commentBox');
    console.log('Database engine started');
})

app.get('/', (req, res)=>{
    currentDb.find({}).toArray((err, result)=>{
        if (err){
            console.log(err);
            throw err;
        }
        res.render('comment.ejs', {commentList: result});
    })
    console.log('Comment list');
})

app.post('/newComment', (req, res)=>{
    console.log(req.body);
    currentDb.insertOne(req.body, (err)=> {
        if (err) {
            console.log(err);
            throw err;
        }
    })
    currentDb.find({}).toArray((err, result)=>{
        if (err){
            console.log(err);
            throw err;
        }
        res.render('comment.ejs', {commentList: result});
    })
    console.log('Comment added');
})

app.get('/comment/:id/edit', (req, res)=>{
    console.log(req.params.id);
    currentDb.findOne(req.params.id, (err, result)=>{
        if (err){
            console.log(err);
            throw err;
        }
        console.log(result);
        res.render('editcomment.ejs', {comment: result});
    })
    console.log('Comment editing page');
})

app.put('/editComment/:id', (req, res)=>{
    console.log(req.body);
    currentDb.updateOne({_id: req.params.id}, {$set:{comment: req.body.comments}}, (err)=>{
        if (err){
            console.log(err);
            throw err;
        }
    })
    currentDb.find({}).exec( (err, result)=>{
        if (err){
            console.log(err);
            throw err;
        }
        res.render('comment.ejs', {commentList: result});
    })
    console.log('Comment changed');
})

app.get('/comment/:id/delete', (req, res)=>{
    currentDb.find({_id: req.params.id}, (err, comment)=>{
        if (err){
            console.log(err);
            throw err;
        }
        res.render('deletecomment.ejs', {comment: comment});
    })
    console.log('Deleting comment');
})

app.delete('/deleteComment/:id', (req, res)=>{
    currentDb.deleteOne(req.params.id, (err)=>{
        if (err){
            console.log(err);
            throw err;
        }
    })
    currentDb.find({}).toArray((err, comments)=>{
        if (err){
            console.log(err);
            throw err;
        }
        res.render('comment.ejs', {commentList: comments});
    })
    console.log('Comment deleted');
})