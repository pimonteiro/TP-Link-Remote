var save = 0;
var deviceID = 0;

function start_controller_load () {
	check_session();
	//valid_login(localStorage.email, localStorage.password);
}

function exit () {
	kill();
	window.location.replace("login.html");
}

function login_post(email, password){
	 //alert("entrei");
			var xhr = new XMLHttpRequest();
			var url = "https://wap.tplinkcloud.com";
			var obj = 
				{
				 "method": "login",
				 "params": {
				 "appType": "Kasa_Android",
				 "cloudUserName": "xxx",
				 "cloudPassword": "xxx",
				 "terminalUUID": "5b504504-5208-4444-a2ef-56dfb989d2fd"
				 }
			};

			obj.params.cloudUserName = email;
			obj.params.cloudPassword = password;

			var data = JSON.stringify(obj);
			
			// alert(data); // testes apenas (retirar versao final)
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(data);

			xhr.onreadystatechange = function () {
				if (xhr.status === 0) {
		    		alert("Sem ligação á internet. Por favor connecte-se e faça restart á aplicação");
				}
				if (xhr.readyState === 4 && xhr.status === 200) {
					var json = JSON.parse(xhr.responseText);
					//console.log(json.email + ", " + json.password);

					if (json.error_code == "-20601") {
						alert("Password incorreta");
					}
					else if (json.error_code == "-20600") {
						alert("Conta não existente");
					}
					else if (json.error_code != "0" && json.error_code != "-20600" && json.error_code != "-20600") {
						alert("Erro login: " + json.msg);
						// window.location.replace("login.html");
					}
					else {
						alert("Login efetuado!");

						localStorage.email = email;
						localStorage.password = password;

						if (save == 0) localStorage.save = 2;  // ira ser acesso temporario
                        	else localStorage.save = save;

						window.location.replace("./index.html") // redirect para o controlador
					}

					
				}
			};
		
}


function LoginRequest () {
	var email = document.getElementById("email").value;
	var password = document.getElementById("pwd").value;
	login_post(email, password);
	  
}


function save_me () {
	save = !save;
}


function check_session () {
	// alert("checking session if exists........");
	console.log(localStorage.save);
	if(localStorage.save == undefined || localStorage.save == "0") {
		alert("Not allowed!"); //TESTES

    	window.location.replace("login.html");
	}
	else if (localStorage.save == "2") {
	    localStorage.save = 0;
	    console.log(localStorage.save);
	    valid_login(localStorage.email, localStorage.password);
	}
	else {
	valid_login(localStorage.email, localStorage.password);
	}
}

//////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function post () {
	console.log(document.getElementById("time").value);
	var t = document.getElementById("time").value;

		sendPOST1();
		setTimeout(sendPOST2, t * 1000);
}
function sendPOST2 () {
	var xhr = new XMLHttpRequest();
	var url = "https://eu-wap.tplinkcloud.com/?token=" + localStorage.token;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	var obj = {
		"method":"passthrough", 
		"params": {"deviceId": "xxx", "requestData": "{\"system\":{\"set_relay_state\":{\"state\":\"x\"}}}" }
		};
	obj.params.deviceId = deviceID;

	var requestDataOb = JSON.parse(obj.params.requestData);

	requestDataOb.system.set_relay_state.state = 0;

	obj.params.requestData = JSON.stringify(requestDataOb)
	
	var data = JSON.stringify(obj);
	// alert(data);

	xhr.send(data);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var json = JSON.parse(xhr.responseText);
			setTimeout(function () {
				document.getElementById("loading").style.visibility = "hidden";}, 1200);
		}
	};
	

	
}

function sendPOST1 () {
	var xhr = new XMLHttpRequest();
	var url = "https://eu-wap.tplinkcloud.com/?token=" + localStorage.token
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	var obj = {
		"method":"passthrough", 
		"params": {"deviceId": "xxx", "requestData": "{\"system\":{\"set_relay_state\":{\"state\":\"x\"}}}" }
		};
	obj.params.deviceId = deviceID;

	var requestDataOb = JSON.parse(obj.params.requestData);

	requestDataOb.system.set_relay_state.state = 1;

	obj.params.requestData = JSON.stringify(requestDataOb)
	
	var data = JSON.stringify(obj);
	// alert(data);

	xhr.send(data);
	xhr.onreadystatechange = function () {
		if (xhr.status === 0) {
			alert("Internet desligada. Por favor abra a app com internet.");
		}
		if (xhr.readyState === 4 && xhr.status === 200) {
			var json = JSON.parse(xhr.responseText);

			if (json.error_code == "0") {
				document.getElementById("loading").style.visibility = "visible";
			}
			if (json.error_code == "-20571") {
				alert("Aparelho Desconectado. Verifique a conexao");
			}
			if (json.error_code != "0" && json.error_code != "-20571") {
				alert(xhr.responseText + "||" + json.msg + "||" + json.error_code);
				//alert("error");
			}

		}
	};
	

	
}

function get_ID () {
	// alert("Getting ID!"); //TESTE
	var xhr = new XMLHttpRequest();
	var url = "https://eu-wap.tplinkcloud.com/?token=" + localStorage.token;
	xhr.open("POST", url, true);

	var data = JSON.stringify(
		{"method":"getDeviceList"}
		);

	xhr.send(data);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var json = JSON.parse(xhr.responseText);

			if (json.error_code != "0"){
				console.log("Erro 'get_ID' : " + json.msg);
			}
			else {
				//alert("Sucess!");
				//console.log(JSON.stringify(json)); //TESTE
				deviceID = json.result.deviceList[0].deviceId;
				console.log("ID: " + deviceID); //TESTE
				get_state();
				setInterval(get_state, 3000);
			}
		}
	};


}

function kill () {
	localStorage.clear();
}


// ---------------------------------------------------------------------------------------------------------------- \\





function valid_login (email, password) {
	var xhr = new XMLHttpRequest();
	var url = "https://wap.tplinkcloud.com";
	var obj = 
		{
		 "method": "login",
		 "params": {
		 "appType": "Kasa_Android",
		 "cloudUserName": "xxx",
		 "cloudPassword": "xxx",
		 "terminalUUID": "5b504504-5208-4444-a2ef-56dfb989d2fd"
		 }
	};

	obj.params.cloudUserName = email;
	obj.params.cloudPassword = password;

	var data = JSON.stringify(obj);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");

	xhr.send(data);

	xhr.onreadystatechange = function () {
		if (xhr.status === 0) {
			alert("Internet desligada. Por favor abra a app com internet");
		}

		if (xhr.readyState === 4 && xhr.status === 200) {
			var json = JSON.parse(xhr.responseText);


			if (json.error_code != "0") {
				alert("Erro 'valid_login': " + json.msg);
				window.location.replace("login.html");
			}
			else {
				localStorage.token = json.result.token;
				get_ID();
			}
		}		
	}
}


function get_state () {
    var xhr = new XMLHttpRequest();
    var url = "https://eu-wap.tplinkcloud.com/?token=" + localStorage.token;
    xhr.open("POST", url, true);
 
    var obj = {"method":"passthrough", "params": {"deviceId": "xxx", "requestData": "{\"system\":{\"get_sysinfo\":null},\"emeter\":{\"get_realtime\":null}}"}};
 
    obj.params.deviceId = deviceID;
 
    var data = JSON.stringify(obj);
 
    xhr.send(data);
 
    xhr.onreadystatechange = function () {
    	if (xhr.status === 0) {
			alert("Internet desligada. Por favor abra a app com internet");
    	}

        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if (json.error_code == "-20571"){
            	console.log("Erro: dispositivo desconectado");
            	document.getElementById("off").style.visibility = "visible";
            	document.getElementById("state").innerHTML = "Desconectado";
            	document.getElementById("state").style.color = "blue";

            }
            else if (json.error_code == "-20002") {
            	console.log("Erro 'get_state' timout");
            }
            else if (json.error_code != "0" && json.error_code != "-20571" && json.error_code != "-20002"){
                console.log("Erro 'get_state' : " + json.msg);
            }
            else {
            	document.getElementById("off").style.visibility = "hidden";
                var temp = JSON.parse(json.result.responseData);
                var estado = temp.system.get_sysinfo.relay_state;
                if (estado == "0") {
                	document.getElementById("state").innerHTML = "Desligado";
                	document.getElementById("state").style.color = "red";
                }
                else {
                    document.getElementById("state").innerHTML = "Ligado";
                    document.getElementById("state").style.color = "green";
                }
                console.log("State: " + temp.system.get_sysinfo.relay_state);
            }
        }
    };
 
}
