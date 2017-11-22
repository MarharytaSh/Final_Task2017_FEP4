var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var fs = require("fs");

app.get('/', (request, response) => {
        console.log('GET');
        var form = fs.readFileSync('public/mapHtml.html');
        response.send(form.toString());
    }
);

app.get('/allTasks', (request, response)=>{
    console.log('GET allTasks');
    var read_task_json = fs.readFileSync('public/tasks_json.json', 'utf-8');
    response.send(read_task_json);
});


function makeID(arr){
    var max = 0;
    for (var x=0; x<arr.length; x++){
        if (arr[x]['ServiceType'].id > max) { max = parseInt(arr[x]['ServiceType'].id);  console.log(max);}
    }
    console.log(max);
    return max + 1;
}

app.post('/TASK', (request, response) => {
        console.log('POST');
        console.log(request.body);
        var serverJSONwithTasks = fs.readFileSync('public/tasks_json.json', 'utf-8');
        var arr = JSON.parse(serverJSONwithTasks);
        var count = makeID(arr);
        request.body.ServiceType.id = JSON.stringify(count);
        arr.push(request.body);
        var arr = JSON.stringify(arr);
         fs.writeFileSync('public/tasks_json.json', arr, 'utf-8');
         var json = fs.readFileSync('public/tasks_json.json', 'utf-8');
        response.send(json);
    }
);

function findIdANDDelete (arr, id){
    var Notmatches = [];
    for(var x=0; x<arr.length; x++){
        if(arr[x]['ServiceType'].id !== id){
            Notmatches.push(arr[x]);
        }
    }
    return  Notmatches;
}

app.delete('/deleteUser', (request, response)=> {
        console.log('DELETE');
        var id = request.body.id;

        var serverJSONwithTasks = fs.readFileSync('public/tasks_json.json', 'utf-8');
        var arr = JSON.parse(serverJSONwithTasks);
        var arr = findIdANDDelete (arr, id);
        var arr = JSON.stringify(arr);
        fs.writeFileSync('public/tasks_json.json', arr, 'utf-8');
        var json = fs.readFileSync('public/tasks_json.json', 'utf-8');
        var json = JSON.parse(json);
        console.log('deleted');
        response.send(json);
    }
);
function changeDate(arr, id){
    var match = {};
    for(var x=0; x<arr.length; x++){
        if(arr[x]['ServiceType'].id === id){
            var match = { ServiceType: arr[x]['ServiceType']};
        }
    }
    console.log( match);
    return  match;
}

app.put('/editeUserONPage', (request, response)=> {
        console.log('PUT');
        var id = request.body.id;

        var serverJSONwithTasks = fs.readFileSync('public/tasks_json.json', 'utf-8');
        var arr = JSON.parse(serverJSONwithTasks);
        var match = changeDate (arr, id);
        var match = JSON.stringify(match);

        response.send(match);
    }
);


function findIdANDDelete (arr, id){
    var Notmatches = [];
    for(var x=0; x<arr.length; x++){
        if(arr[x]['ServiceType'].id !== id){
            Notmatches.push(arr[x]);
        }
    }
    return  Notmatches;
}

app.put('/TASKchangedTOsave', (request, response)=> {
    console.log('PUT TASK_changed_TO_save');
    var id = request.body['ServiceType'].id;

    var serverJSONwithTasks = fs.readFileSync('public/tasks_json.json', 'utf-8');
    var arr = JSON.parse(serverJSONwithTasks);
    var  Notmatches = findIdANDDelete (arr, id);

    Notmatches.push(request.body);
    var Notmatches = JSON.stringify(Notmatches);
    var json =fs.writeFileSync('public/tasks_json.json', Notmatches, 'utf-8');
    var jsonREAD = fs.readFileSync('public/tasks_json.json', 'utf-8');
        response.send(jsonREAD);
    }
);




app.listen(3006, (request, response) => {
    console.log('started');
})
;