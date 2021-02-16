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
var luxControlLow = document.querySelector("#luxControlLow")
var connect_btn = document.querySelector("#connect_btn")
var connection = document.querySelector("#connection")
var poliv_btn = document.querySelector("#poliv_btn")
var send_btn = document.querySelector("#send_btn")
var m_btn = document.querySelector("#m_btn")
var avalue_btn = document.querySelector("#avalue_btn")
var dht_btn = document.querySelector("#dht_btn")
var lux_btn = document.querySelector("#lux_btn")
var window_btn = document.querySelector("#window_btn")
var light_btn = document.querySelector("#light_btn")
var aval = document.querySelector("#aval")
var regim = document.querySelector("#regim")
var temp = document.querySelector("#temp")
var hum = document.querySelector("#hum")
var lux = document.querySelector("#lux")
var polivSost = document.querySelector("#polivSost")
var svetSost = document.querySelector("#svetSost")
var oknoSost = document.querySelector("#oknoSost")
var temper = document.querySelectorAll(".temper");
var nul = [32,32,32,32,32,32,32,32,32,32,32] ;
var isManualControl = 0;
var isPolivControl = 0;
var isLightControl = 0;
var isWindowControl = 0;

// var r
//  function timer() {
//  r = setInterval("Send('/feeder_graf', (Math.round(Math.random() *100)).toString())", 2000)  
//  }

//КНОПКИ ПАНЕЛИ УПРАВЛЕНИЯ:
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
Send("manual", "okno_close");
isWindowControl = 0;
console.log("Окно закрыли");}
  else
if (isWindowControl == 0)  {
Send("manual", "okno_open");
isWindowControl = 1;
console.log("Окно открыли");}
});
  
light_btn.addEventListener("click", () =>{
if (isLightControl == 1)  {
Send("manual", "svet_off");
isLightControl = 0;
console.log("Свет выключили");}
  else
if (isLightControl == 0)  {
Send("manual", "svet_on");
isLightControl = 1;
console.log("Свет включили");}
});

poliv_btn.addEventListener("click", () =>{
if (isPolivControl == 1)  {
Send("manual", "pompa_off");
isPolicControl = 0;
console.log("Полив выключили");}
  else
if (isPolivControl == 0)  {
Send("manual", "pompa_on");
isPolivControl = 1;
console.log("Полив включили");} 
});

avalue_btn.addEventListener("click", () =>{
  Send("avalue", "info");
  console.log("Запрос на влажность почвы отправили");
  // timer(); 
});

lux_btn.addEventListener("click", () =>{
  Send("infoL", "info");
  console.log("Запрос на освещенность отправили");
});

dht_btn.addEventListener("click", () =>{
  Send("infoT", "info");
  Send("infoH", "info");
  console.log("Запрос на данные DHT отправлен");
 //   nul.shift()
 //   nul.push("jj");
 // for (var i=0; i<=9; i++) {
 //    temper[i].innerHTML = nul[i] + 'px';}
   // clearInterval(r);
});

send_btn.addEventListener("click", () =>{
avalControl = avalTransform(avalControl.value).toString(); 
tempControlHigh = tempControlHigh.value;
tempControlLow = tempControlLow.value;
luxControlLow = luxControlLow.value;
console.log("Данные обрабатываются...");  

if (avalControl && avalControl!="")  {
console.log("Отправляю влажность почвы");  
Send("humMin", avalControl);
avalControl == 0;}

if (tempControlHigh && tempControlHigh!= "")  {
console.log("Отправляю вверх температуры");  
Send("tempHigh", tempControlHigh);
tempControlHigh = 0;} 

if (tempControlLow && tempControlLow!="")  {
console.log("Отправляю низ температуры");  
Send("tempLow", tempControlLow);
tempControlLow = 0;}

if (luxControlLow && luxControlLow!="")  {
  console.log("Отправляю освещенность"); 
  Send("luxLow", luxControlLow);
  tempControlLow = 0;}  
console.log("Данные отправлены");
});


connect_btn.addEventListener("click", ()=> {
client.connect(options);
connection.innerHTML="Состояние: ПОДКЛЮЧАЕМСЯ..."} );
//ТОПИКИ, НА КОТОРЫЕ ПОДПИСАНЫ:
function onConnect() {
  client.subscribe("manual");  
  client.subscribe("humMin");
  client.subscribe("tempHigh");
  client.subscribe("tempLow");
  client.subscribe("luxLow");
  client.subscribe("infoH"); 
  client.subscribe("infoT");
  client.subscribe("infoL");
  client.subscribe("answer");   
  client.subscribe("avalue");
  client.subscribe("/feeder");
  client.subscribe("/feeder_graf");

    connection.innerHTML="Состояние: ПОДКЛЮЧИЛИСЬ..."
    Send("/feeder", "Клиент (сайт) подключился к брокеру MQTT-сообщений");

    
//ФУНКЦИЯ ПЕРЕПОДКЛЮЧЕНИЕ:
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
      function avalTransform(aval){
        aval = (1024 - parseInt(aval,10))*100/(1024-300)
        aval = aval.toFixed(2);
        if(aval>100) aval=100.00;
        return aval;
      }  
        
      case "avalue":
        if (message.payloadString != "info"){
          let avalMessage = avalTransform(message.payloadString);
          aval.innerHTML= avalMessage + "%";
          console.log("Влажность почвы: " + avalMessage)}
        break;
        
      case "infoT":
        if (message.payloadString != "info"){ 
          temp.innerHTML= message.payloadString + "°С";
          console.log("Температура воздуха" + message.payloadString)}
        break; 
        
      case "infoH":
        if (message.payloadString != "info"){ 
          hum.innerHTML= message.payloadString + "%";
          console.log("Влажность воздуха" + message.payloadString)}
        break; 

       case "infoL":
        if (message.payloadString != "info"){ 
          lux.innerHTML= message.payloadString + " lux";
          console.log("Уровень освещенности" + message.payloadString)}
        break;  
        
      case "answer":
        switch (message.payloadString) {
          case "okno_open":
            oknoSost.innerHTML= " Открыто";
            console.log(message.payloadString)
            break; 
        
          case "okno_close":
            oknoSost.innerHTML= " Закрыто";
            console.log(message.payloadString)
            break; 

          case "svet_on":
            svetSost.innerHTML= " Включено";
            console.log(message.payloadString)
            break; 
        
          case "svet_off":
            svetSost.innerHTML= " Выключено";
            console.log(message.payloadString)
            break;

          case "pompa_on":
            polivSost.innerHTML= " Включено";
            console.log(message.payloadString)
            break; 
        
          case "pompa_off":
            polivSost.innerHTML= " Выключено";
            console.log(message.payloadString)
            break;

        default:
          break;
        }

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




