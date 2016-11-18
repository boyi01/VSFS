var WebSocketServer = require('websocket').server,
    http = require('http'),
    CLIENTS=[],
    u=0,
    chatraum=[],
    name=[],
    server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});



wsServer = new WebSocketServer({  httpServer: server,});



wsServer.on('request', function(request) {





        var connection = request.accept('chat');

CLIENTS[u]= connection;
  u++;
    connection.on('message', function(message) {

             if (message.type === 'utf8') {
            //   console.log('eingehenNachricht: '+message.utf8Data);
              var steu= message.utf8Data.substring(0,message.utf8Data.indexOf('?'))
                var inhalt = message.utf8Data.substring(message.utf8Data.indexOf('?')+1)



                // Neuer Client verbindet sich, Name und Chatraum werden seiner verbindung zugeordnet
                if(steu.indexOf('einloggen#')===0){

                    steu =  steu.substring(steu.indexOf('#')+1)

                        for (var i=0; i<CLIENTS.length; i++) {
                          if(CLIENTS[i]===connection){
                            name[i] = steu.substring(steu.indexOf('#')+1);
                            chatraum[i] = steu.substring(0,steu.indexOf('#'));

                              console.log('User ' + name[i]+' Connected in Chatraum '+ chatraum[i]);
                            break;
                          };
                        };
                    };
                    for (var i=0; i<CLIENTS.length; i++) {
                      if(CLIENTS[i]===connection){

                        //  console.log('Von Client i '+i);
                        break;
                      };
                    };
                    if(inhalt!=''){

                 send(inhalt,connection);
               };

           };

    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function send (message,absender) {
var absender_n='';
  for (var i=0; i<CLIENTS.length; i++) {

    if(CLIENTS[i]==absender){
      absender_n=i;
      console.log(i);
    }
    }

    if(message.substring(0,7)!='#geTex#')
    {message=name[absender_n]+" : " +message };

    for (var i=0; i<CLIENTS.length; i++) {
     //console.log(i);
      if(chatraum[i]==chatraum[absender_n]){
        var ausnahme = true;
        if(message.substring(0,7)==='#geTex#'){
          console.log(absender_n);
          if(absender_n===i)
          { ausnahme = false  }
        }
        if(ausnahme){
       console.log('Absender n : '+absender_n+ 'Empfänger n: '+ i);
       CLIENTS[i].sendUTF(message);
     };
      }
   }

}
