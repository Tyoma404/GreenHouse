//in the process...
//настройка кнопки регистрации
sign_btn.addEventListener("click", async()=> {
    var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyARBkhuz8A8LZgPc2WrhMkkuZkQ-yvvqLQ';
    var data = {"email": email.value, "password": pass.value, "returnSecureToken": true};
    response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    commits = await response.json(); 
    token = commits.idToken;
    console.log(token);
      });
    
    passTest.addEventListener("input", function() {
      pass.value != passTest.value ? passTest.labels[0].style.color = "red" : 
      passTest.labels[0].style.color = "black";
    })
    
    
  
    //настройка кнопки авторизации
    signIn_btn.addEventListener("click", async()=> {
      var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyARBkhuz8A8LZgPc2WrhMkkuZkQ-yvvqLQ'
      var data = {"email": emailIn.value, "password": passIn.value, "returnSecureToken": true};
      response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      commits = await response.json();
      token = commits.idToken;
      //console.log(commits); 
    
      var xhr = new XMLHttpRequest();
      var url = 'https://js-slider.firebaseio.com/imgs/-M1wz-cjdTcj35bg6Qbp/images.json?auth=' + token;
      
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.addEventListener("readystatechange", () => {
    
    // если состояния запроса 4 и статус запроса 200 (OK)
    if ((xhr.readyState==4) && (xhr.status==200)) {
      // например, выведем объект XHR в консоль браузера
        console.log(xhr.response[0]);
    for (var i=0; i<xhr.response.length; i++){
      let img = document.createElement('img');
      img.className = "images";
      img.src = xhr.response[i]
      imgs.appendChild(img);
  }  