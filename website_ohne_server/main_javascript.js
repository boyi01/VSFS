///INHALTE//Sollte in einen Datenbank ausgelagert werden//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var definitionen_gesammtheit = {

  wwi15amb : {
//VWL
          VWL : [
            {name: "1",name_echt:"Korrektheit", definition: "<span>vollumfängliche</span> Umsetzung <span>Anforderungen</span>"},
            {name: "2", name_echt: "Marktpreis", definition: "Der <span>Preis</span> den das <span>Gut</span> auf dem <span>Markt</span> kostet"},
            {name: "3", name_echt: "Marktnachfragekurve", definition: "Nachgefrage Gesamtmenge eines Gutes, bei unterschiedlichen Preisen des Gutes"},
            {name: "4", name_echt: "Marktgleichgewicht", definition: "Angebot und Nachfrage gleich"},
            {name: "5", name_echt: "Nachfrage", definition: "Die Nachfrage wird vom Käufer bestimmt"},
            {name: "6", name_echt: "Nachfragemenge", definition: "Die Nachgefrage Menge"},
            {name: "7", name_echt: "Produktionsregel", definition: "Regel um mit Grammatik Sätze zu bilden unter Verwendung Basisbausteine"}

//IT
          ],

          IT : [


            {name: "1", name_echt: "Prozess", definition: "Ein in <span>Ausführung</span> befindliches <span>Programm</span>"}
            ],



//JAVA
			Java : [


            	{name: "1", name_echt: "Produktionsregel", definition: "Regel um mit <span>Grammatik</span> Sätze zu bilden unter <span>Verwendung</span> Basisbausteine"}

          	]





  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Seiten für die ein Kurs und ein Fach nötig ist
var fk_nichtleer = ["Upload","definition"];


//ruft die Funktion hashchange auf wenn sihc der Hashwert Ändert, durch Buttons oder Vor und Zurück
window.addEventListener('hashchange', hashchange );
 //Ruft die reload funktion auf sobald das Dom bekannt ist
window.addEventListener('DOMContentLoaded', reload );

//Für die Dynamische Seite notwendig
localStorage.setItem('oldHASH','');
// Für eine Checkbox bei definition
var deffcheck_var =0;

//ermöglicht beim aufruf über einen Link das man direkt zum im Hash vermerkten inhalt kommt, bzw wenn man die Seite reloaded
//weiter Funtkionen welche erst nach dem Dom aufbau möglich sind
function reload(){
  var login =  "";
  var dropZone = document.getElementById("drop_zone");

//Login
if(sessionStorage.getItem("login")===null||sessionStorage.getItem("login")==="null"){
  // Wenn im sessionStorage kein s-user vorhanden ist
  login = prompt("Bitte geben sie Ihren sUser ein!");
  sessionStorage.setItem("login",login);
  }
else {
  // Falls er da ist
  login=sessionStorage.getItem("login")
  }

//  überprüfen des S-Users
 if(login.substring(0,4)!='s151')
 {
   alert("Dies ist kein Gültiger User");
   //Neuanfang sollte der s-user falsch sein
   sessionStorage.setItem("login",null)
   reload();
 }

// Sollte breits ein hashwert vorhanden sein
if( window.location.hash!="" )
   {

    Startseite.style.display="none";
    console.log(window.location.hash.substr(1,window.location.hash.length-1));
    // Diese Codezeile fragt den Aktuelle Hash hab und verändert auf desen Basis den Style.display
     document.getElementById(window.location.hash.substr(1,window.location.hash.length-1)).style.display="inline";
     localStorage.setItem('oldHASH',window.location.hash);
   }

     // Eventlistner

document.querySelector('#deffcheck').addEventListener('change', deff_ueben_lernen);
dropZone.addEventListener('dragover', handleDragOver, false);
window.addEventListener('hashchange', def_liste);
dropZone.addEventListener('drop', handleFileSelect, false);
document.querySelector('#definitions_auswahl').addEventListener('change', deff_auswaelen);
document.querySelector('#gemeisamer_Text').addEventListener('keyup',an_server);
// enter abschicken
document.querySelector('#message').addEventListener('keypress',function (e){
  var key = e.which || e.keyCode;
   if (key === 13) {
     nachricht_senden();
   }
 });


// localStorage_werte auslesen

if(localStorage.getItem("Kurs")!==null)
{
document.getElementById('Kurswahl_button').innerHTML="Kurs: "+localStorage.getItem("Kurs");
}
if(localStorage.getItem("Fach")!==null){
document.getElementById('Fachwahl_button').innerHTML="Fach: "+localStorage.getItem("Fach");
def_liste();
}

if(localStorage.getItem("chatname")!==null)
{
  if(localStorage.getItem("chatraum")!==null){
    alert("Du wurdest im Chat eingelogt");
      verbinden()
  };
};
}

//ändert nach einem Hashchange die Seite entsprechend
function hashchange(){
  //sollte vor der Änderung kein Hash dagewesen sein, wird Startseite als Hash angenommen und sichbargemacht
  if(localStorage.getItem('oldHASH') === "")
  {Startseite.style.display="none";}
  else {
  document.getElementById(localStorage.getItem('oldHASH').substr(1,localStorage.getItem('oldHASH').length-1)).style.display="none";
  //sollte ein alter Hash da sein wird dieser Unsichtbar gemacht
  }
  // ist der neue Hash leer so wird Startseite aufgerufen
if(window.location.hash=="")
{Startseite.style.display="inline"}
else {
  // Diese Codezeile fragt den Aktuelle Hash hab und verändert auf desen Basis den Style.display
  document.getElementById(window.location.hash.substr(1,window.location.hash.length-1)).style.display="inline";
localStorage.setItem('oldHASH',window.location.hash);
}
}
//Seiten bedinungen Checheken
// funktion bedinung_seite_wechsel(){




// }



function zu_Seite(Seitennamen){ // Allgemeine Funktion um ein neues Div sichtbar zu machen
//Ändert den Hash der Seite um neue Objekte sichtbar zu machen
window.location.hash=Seitennamen;
}

// Hier beginnt der CHAT

var connection =  new WebSocket('ws://localhost:8081/', 'chat'),
    chat='';
//Verbidnung zu Websocket


function chat_einlogen(){

  if(document.getElementById("chatname").value==""){
    alert("Chatname fehlt, bitte ausfüllen")
  }
  else if (document.getElementById("chatraum").value=="") {
    alert("Chatraum fehlt, bitte ausfüllen")
  }
  else {
    var chatraum = document.getElementById("chatraum").value;
    var chatname = document.getElementById("chatname").value;
    localStorage.setItem("chatraum",chatraum);
    localStorage.setItem("chatname",chatname);
    window.location.hash='Startseite';
    verbinden();
  }
}



function verbinden(){
  //Sendet Parameter zum Chat Start


  document.getElementById('send-message').style.display="inline";
  document.getElementById('chateinloggen').style.display="none";


  connection.send('einloggen#' + localStorage.getItem("chatraum") + '#' + localStorage.getItem("chatname") +'?');
document.getElementById('Chat_anmelden_button').innerHTML="Chat: "+localStorage.getItem("chatname")+"@"+localStorage.getItem("chatraum");

}

function nachricht_senden(){
  //Dieses Fragenzeichen wird dafür verwendet da keine Befehl mitgegeben wird
  connection.send('?'+document.getElementById('message').value);
  document.getElementById('message').value="";
}

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

//aAchircht empfangen
connection.onmessage = function (e) {

//überprüfen ob der Text für den Chat oder für die Gemeisamen Textbox ist
if(e.data.substring(0,7)=='#geTex#'){
document.getElementById('gemeisamer_Text').value=e.data.substring(7);

}
else{
  chat = chat +'<p>'+ e.data+ '</p>';
  console.log(chat);
  document.getElementById('chat').innerHTML= chat;
  };
};

// Text von der gemiensame Chatbox
function an_server() {

  connection.send('?#geTex#'+document.getElementById('gemeisamer_Text').value);

}



//Hier beginnt Drag and drop
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // Belegung der Liste mit den Daten aus dem dataTransfer

  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}



function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
  // Aktivieren der Listener




//Kurswahl
function kurswahl(kurs_name){
  localStorage.setItem("Kurs",kurs_name);
  document.getElementById('Kurswahl_button').innerHTML="Kurs: "+kurs_name;
  window.location.hash='Startseite';
  }
function fachwahl(fach_name){
  localStorage.setItem("Fach",fach_name);
  document.getElementById('Fachwahl_button').innerHTML="Fach: "+fach_name;
  window.location.hash='Startseite';
  }

//Wechsel zwischen den Lernmodi
function deff_ueben_lernen(){
  // definitionen abfragen
if(deffcheck.checked){
  document.getElementById('deff_div').style.display="none";
  document.getElementById('inputt-div').style.display="inline";

  document.getElementById('deff_button').innerHTML="Überprüfen";
  deffcheck_var = 1;
}
// definitionen lernen
else {
  deffcheck_var = 0;
  document.getElementById('deff_div').style.display="inline";
  document.getElementById('inputt-div').style.display="none";

    document.getElementById('deff_button').innerHTML="Weiter";
  }
}

//Überprüfen des eingeben Textes
function ueberpruefen(){

  if (deffcheck_var === 1){

    var a = document.getElementById("inputt-div").value; //Eingabe in String umwandeln
    var woerter = []; //Zu vergleichende Stichwörter
var i=0;
def_text=  definitionen_gesammtheit[localStorage.getItem("Kurs")][localStorage.getItem("Fach")][parseInt(document.getElementById('definitions_auswahl').value)].definition;
// Text der definition raussuchen
//Aufsuchen der Stichwörter
    while(i>-1){

      if(def_text.lastIndexOf('<span>')===-1)
{i=-10;}
      else
      {
      woerter[i] =def_text.substring(def_text.lastIndexOf('<span>')+6,def_text.lastIndexOf('</span>'));
      def_text = def_text.substring(0,def_text.lastIndexOf('<span>'));

      i++;
    }


    }



    var treffer = 0;

    var auswurf = new String;
    auswurf = "Die Wörter sind: ";
    for(var i=0;i<woerter.length;i=i+1) // String so belegen, dass angezeigt wird welche Wörter dabei sein sollen
        {
            var compare = woerter[i];
            auswurf = auswurf + compare + ", ";
        }
    auswurf = auswurf + "Richtige Stichwörter von dir:";


    for(var i=0;i<woerter.length;i=i+1) // String so belegen, dass für die richtigen Wörter das Wort und für fehlende null ausgegeben wird
        {
            var compare = a.match(woerter[i]);
            if(compare!==null){
                auswurf = auswurf + compare + ", ";
              treffer ++;
            }
        }


        var treffer = (parseInt(treffer)/parseInt(woerter.length))*100
        auswurf= "Du hast: "+ treffer +"% richtig \n "+ auswurf
        document.getElementById('inputt-div').value="";

    alert(auswurf); // der alert
  }
  naechste_def();
  }





// wechselt zur nächsten Definition
function naechste_def(){
  var naechste_def = 0;

  naechste_def =parseInt(document.getElementById('definitions_auswahl').value)+1;

  max_def = definitionen_gesammtheit[localStorage.getItem("Kurs")][localStorage.getItem("Fach")].length

  if(parseInt(max_def)-1<naechste_def){
    naechste_def=1;
  }

  document.getElementById('definitions_auswahl').value=naechste_def;

  deff_auswaelen()

  }


function deff_auswaelen(){

document.getElementById('deff_div').innerHTML=

 definitionen_gesammtheit[localStorage.getItem("Kurs")][localStorage.getItem("Fach")][parseInt(document.getElementById('definitions_auswahl').value)].definition;


}

function def_liste(){



 var def_liste_namen="";

  for (var i = 0; i<definitionen_gesammtheit[localStorage.getItem("Kurs")][localStorage.getItem("Fach")].length; i++) {
  def_liste_namen = def_liste_namen +'<option value="'+ i +'">'+
  definitionen_gesammtheit[localStorage.getItem("Kurs")][localStorage.getItem("Fach")][i].name_echt+'</option>';
}
document.getElementById('definitions_auswahl').innerHTML=def_liste_namen;
deff_auswaelen();
}
