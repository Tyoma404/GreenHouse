//НАСТРОЙКА ТОПЕРА:
mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//КОНЕЦ ТОПЕРА

//НАСТРОЙКА MQTT:
client = new Paho.MQTT.Client("m24.cloudmqtt.com", 37582,"Greenhouse");
 client.onConnectionLost = onConnectionLost;
 client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: "ligjvynx",
    password: "HRqsxRjqpHcM",
    onSuccess:onConnect,
    onFailure:doFail
  }
// КОНЕЦ НАСТРОЙКИ MQTT

//ПЕРЕМЕННЫЕ:
// var range = document.querySelector('#range');
var avalControl = document.querySelector("#avalControl")
var tempControlHigh = document.querySelector("#tempControlHigh")
var tempControlLow = document.querySelector("#tempControlLow")
var connect_btn = document.querySelector("#connect_btn")
var connection = document.querySelector("#connection")
var poliv_btn = document.querySelector("#poliv_btn")
var send_btn = document.querySelector("#send_btn")
var m_btn = document.querySelector("#m_btn")
var avalue_btn = document.querySelector("#avalue_btn")
var dht_btn = document.querySelector("#dht_btn")
var window_btn = document.querySelector("#window_btn")
var light_btn = document.querySelector("#light_btn")
var aval = document.querySelector("#aval")
var regim = document.querySelector("#regim")
var temp = document.querySelector("#temp")
var hum = document.querySelector("#hum")
var polivSost = document.querySelector("#polivSost")
var svetSost = document.querySelector("#svetSost")
var oknoSost = document.querySelector("#oknoSost")
var temper = document.querySelectorAll(".temper");
var nul = [32,32,32,32,32,32,32,32,32,32,32] ;
var isManualControl = 0;
var isPolivControl = 0;
var isLightControl = 0;
var isWindowControl = 0;
//КОНЕЦ ПЕРЕМЕННЫХ

// var r
//  function timer() {
//  r = setInterval("Send('/feeder_graf', (Math.round(Math.random() *100)).toString())", 2000)  
//  }

//КНОПКИ:
m_btn.addEventListener("click", () =>{
if (isManualControl == 1)  {
Send("manual", "off");
regim.innerHTML = "auto";  
isManualControl = 0;
console.log("Ручной режим выключен");}
  else
if (isManualControl == 0)  {
Send("manual", "on");
regim.innerHTML = "manual";  
isManualControl = 1;
console.log("Ручной режим включен");}
});

window_btn.addEventListener("click", () =>{
if (isWindowControl == 1)  {
Send("okno_m", "close");
isWindowControl = 0;
console.log("Окно закрыли");}
  else
if (isWindowControl == 0)  {
Send("okno_m", "open");
isWindowControl = 1;
console.log("Окно открыли");}
});
  
light_btn.addEventListener("click", () =>{
if (isLightControl == 1)  {
Send("svet_m", "off");
isLightControl = 0;
console.log("Свет выключили");}
  else
if (isLightControl == 0)  {
Send("svet_m", "on");
isLightControl = 1;
console.log("Свет включили");}
});

poliv_btn.addEventListener("click", () =>{
if (isPolivControl == 1)  {
Send("pompa_m", "off");
isPolicControl = 0;
console.log("Полив выключили");}
  else
if (isPolivControl == 0)  {
Send("pompa_m", "on");
isPolivControl = 1;
console.log("Полив включили");} 
});

avalue_btn.addEventListener("click", () =>{
  Send("avalue", "info");
  console.log("Запрос на влажность почвы отправили");
  // timer(); 
});

dht_btn.addEventListener("click", () =>{
  Send("DHT", "info");
  console.log("Запрос на данные DHT отправлен");
 //   nul.shift()
 //   nul.push("jj");
 // for (var i=0; i<=9; i++) {
 //    temper[i].innerHTML = nul[i] + 'px';}
   // clearInterval(r);
});

send_btn.addEventListener("click", () =>{
avalControl = parseInt(avalControl.value, 10); 
tempControlHigh = parseInt(tempControlHigh.value, 10);
tempControlLow = parseInt(tempControlLow.value, 10);
console.log("Данные обабатываются...");  
if (avalControl != 0)  {
Send("pompa", avalControl);
avalControl == 0;}
if (tempControlHigh != 0)  {
Send("oknoHigh", tempControlHigh);
tempControlHigh = 0;} 
if (tempControlLow != 0)  {
Send("oknoLow", tempControlLow);
tempControlLow = 0;}  
console.log("Данные отправлены");
});


connect_btn.addEventListener("click", ()=> {
client.connect(options);
connection.innerHTML="Состояние: ПОДКЛЮЧАЕМСЯ..."} );
//ТОПИКИ, НА КОТОРЫЕ ПОДПИСАНЫ:
function onConnect() {
  client.subscribe("manual");  
  client.subscribe("okno_m");  
  client.subscribe("svet_m");  
  client.subscribe("pompa_m");  
  client.subscribe("pompa");
  client.subscribe("pompa_otv");
  client.subscribe("svet_otv"); 
  client.subscribe("oknoHigh");
  client.subscribe("oknoLow");
  client.subscribe("okno_otv");
  client.subscribe("DHT");
  client.subscribe("DHT/get1");
  client.subscribe("DHT/get2");    
  client.subscribe("avalue");
  client.subscribe("avalue/get");
  client.subscribe("/feeder");
  client.subscribe("/feeder_graf");
    connection.innerHTML="Состояние: ПОДКЛЮЧИЛИСЬ..."
    Send("/feeder", "Клиент (сайт) подключился к брокеру MQTT-сообщений");
//КОНЕЦ КНОПОК
  
//ПЕРЕПОДКЛЮЧЕНИЕ:
  }
 function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      connection.innerHTML="Состояние: ОТКЛЮЧИЛИСЬ..."
    }
  }
function doFail(e){
    console.log(e);
  }
//КОНЕЦ ПЕРЕПОДКЛЮЧЕНИЯ

//КОГДА ЧТО-ТО ПРИХОДИТ:
function onMessageArrived(message) {
    /// общий вывод в журнал
    //mqttMess.innerHTML += `\<br>`+message.destinationName + '  ' + message.payloadString;
    switch (message.destinationName) {
      case "/feeder":
       
        console.log(message.payloadString)
        break;
        
//       case "/feeder_graf":
       
//         console.log(message.payloadString)
//    nul.shift()
//    nul.push(message.payloadString);
//    for (var i=0; i<=9; i++) {
//      temper[i].innerHTML = nul[i] + 'px';
//     temper[i].style.height = nul[i] + 'px';
//    }
        // break;
        
         case "avalue/get":
       aval.innerHTML= message.payloadString;
        console.log(message.payloadString)
        break;
        
         case "DHT/get1":
       temp.innerHTML= message.payloadString + "°С";
        console.log(message.payloadString)
        break;   
        
         case "DHT/get2":
       hum.innerHTML= message.payloadString + "%";
        console.log(message.payloadString)
        break; 
        
         case "pompa_otv":
       polivSost.innerHTML= message.payloadString;
        console.log(message.payloadString)
        break;
        
         case "svet_otv":
       svetSost.innerHTML= message.payloadString;
        console.log(message.payloadString)
        break;
        
         case "okno_otv":
       oknoSost.innerHTML= message.payloadString;
        console.log(message.payloadString)
        break;        
        
        
        
      default:
        break;
    }
  }

function Send(topic,body) {
    message = new Paho.MQTT.Message(body);
    message.destinationName = topic;
    client.send(message);
}



//НАСТРОЙКА СЛАЙДЕРА:

var btn_prev = document.querySelector('#prev');  /* отбирает всегда самый первый элемент, удовлетворяющий css-селектору */
var btn_next = document.querySelector('#next');
var firstPicture = document.querySelector("#photos > img:first-child");
var images = document.querySelectorAll('#photos > img'); /*отбирает все картинки в массив images */
var buttonsSlider = document.querySelectorAll('.buttons');
var q = 0; /* номер картинки в массиве */
var imageLength = images.length;
images[q].className = "active";

btn_prev.addEventListener("click", () => {
images[q].className = ''; /*текущая фотка получает класс неактивной*/
  q = q - 1; /* или i-- */
  // if (q != 0){firstPicture.className = '';}
  // if (q == 0){firstPicture.className = 'active';}
  if(q < 0) {
    q=imageLength-1;  /* отмотал в начало? продолжает с конца. '-1' чтобы учитывать нулевой элемент массива*/
  }
  images[q].className = 'active'; /*то фото, к которому переходим получает класс активного */  
});

btn_next.addEventListener("click", function() {
  images[q].className = '';
  q = q + 1; /* или i++ */
  // if (q != 0){firstPicture.className = '';}
  // if (q == 0){firstPicture.className = 'active';}
  if(q >= imageLength) {
    q = 0; /* кончились картинки ? продолжает с первой */
     // firstPicture.className = 'active';
  }
  images[q].className = 'active';  
});

for(var i=0; i<buttonsSlider.length; i++){
 buttonsSlider[i].addEventListener("click", function(){
     console.log("jkhkjnbkjn")

   images[q].className = '';
   // if (event.target.value != 0){
   //   firstPicture.className = '';}
   // if (event.target.value == 0)
   // {firstPicture.className = 'active'; }
     images[event.target.dataset.name].className = 'active'; 
     q = parseInt(event.target.dataset.name);  
   });
  
 buttonsSlider[i].addEventListener("mouseenter", function(){
    console.log("Курсор наведён на " + event.target.dataset.name + " картинку");
  });
 }
//КОНЕЦ СЛАЙДЕРА