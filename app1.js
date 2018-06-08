var app = require('express')(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.listen(80, ()=>{
    console.log('server is started');
})
//extrating body from request
app.use(bodyParser.urlencoded({extended : true}));
// for using put & delete request for html form
app.use(methodOverride('_method'));

mongoose.connect('mongodb://127.0.0.1:27017/mydb', (err)=>{
    if (err){
        console.log(err);
        throw err;
    }else {
        console.log('Database engine is connected');
    }
})

/*mongo.connect('mongodb://127.0.0.1:27017/', (err, db)=>{
    if (err) throw err;
    currentDb = db.db('mydb');
    currentDb = currentDb.collection('commentboxes');
    console.log('mongo is connected');
})*/

var commentSchema = new mongoose.Schema({
    username : String ,
    comments : String ,
    id : false
})

var comment = mongoose.model('commentBox', commentSchema);

app.get('/', (req, res)=>{
    comment.find({}, (err, result)=>{
        if (err) throw err;
        res.render('comment.ejs', {commentList: result});
    })
	console.log('Home');
})

app.post('/newComment', (req, res)=>{
    console.log(req.body);
    comment.create(req.body, (err, comments)=>{
        if (err){
            console.log(err);
            throw err;
        }
        console.log(comments);
    })
    res.redirect('/');
    console.log('Comment added');
})

app.get('/comment/:id/edit', (req, res)=>{
    comment.findById(req.params.id, (err, comments)=>{
        if (err) throw err;
        console.log(comments);
        res.render('editcomment.ejs', {comment: comments});
    })
})

app.put('/editComment/:id', (req, res)=>{
    comment.findByIdAndUpdate(req.params.id, req.body, (err, updated)=>{
        if (err) throw err;
        console.log(updated+'\nComment is updated of id'+req.params.id);
    })
    res.redirect('/');
})

app.get('/comment/:id/delete', (req, res)=>{
    comment.findById(req.params.id, (err, comment)=>{
        if (err) throw err;
        console.log(comment);
        res.render('deletecomment.ejs', {comment: comment});
    })
})

app.delete('/deleteComment/:id', (req, res)=>{
    comment.findByIdAndRemove(req.params.id, (err, comment)=>{
        if (err) throw err;
        console.log('Comment deleted'+comment);
    })
    res.redirect('/');
})
//update --> put
//destroy --> delete

/*app.get('/newCommentList', (req, res)=>{
    res.render('newCommentList.ejs');
    console.log('newCommentList');
}

app.post('/creatingCommentList', (req, res)=>{
    console.log(req.body);
    dbObject.createCollection(req.body.newCommentList, (err, result)=>{
        if (err){
            //console.log(err);
            throw err;
        }
        console.log('Data base created with name '+ result);
    })
    dbObject.collection('commentBoxName').insertOne({availableData: req.body.newCommentList}, (err, result)=>{
        if (err){
            console.log(err);
            throw err;
        }
    })
    dbObject.collection('commentBoxName').find({}).toArray((err, result)=>{
        console.log(result);
    });
    res.render('commentList.ejs');//, {commentTopics: commentCollection});
})

app.get('/commentList', (req, res)=>{
    console.log('commentList');
    dbObject.collection('commentBoxName').find({}).toArray((err, result)=>{
        console.log(result);
    });
    res.render('commentList.ejs');//, {commentTopics: dbObject.listCollections()});
})*/

app.get('*', (req, res)=>{
    console.log('something wrong');
    res.send('Error 404<br>Server not found');
})