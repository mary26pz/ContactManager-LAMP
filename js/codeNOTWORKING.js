const urlBase = 'http://31contacts.tk/';
const extension = 'php';

// INSECURE IMPLEMENTATION OF ACCESS CONTROL ALLOWED ORIGIN HEADERS
//res.setHeader("Access-Control-Allow-Origin", "*"); 

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
//	alert(login);
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
//	alert(password);

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:hash};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

// THIS IS INSECURE

	xhr.setRequestHeader("Access-Control-Allow-Origin", url);

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
    userId = 0;
    firstName = "";
    lastName = "";

    window.location.href = "register.html";
}

function doRegister()
{
    userId = 0;
    firstName = "";
    lastName = "";

    firstName = document.getElementById("userFirstName").value;
    lastName = document.getElementById("userLastName").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5( password );

		if (firstName!="" && lastName!="" && login!="" && password!=""){
		    document.getElementById("registerResult").innerHTML = "";

		    let tmp = {firstName:firstName,lastName:lastName,login:login,password:hash};
		//    var tmp = {login:login,password:hash};
		    let jsonPayload = JSON.stringify( tmp );

		    let url = urlBase + 'LAMPAPI/Register.' + extension;

		    let xhr = new XMLHttpRequest();
		    xhr.open("POST", url, true);
		    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		    // xhr.setRequestHeader("Access-Control-Allow-Origin", url);
		    try
		    {
		        xhr.onreadystatechange = function()
		        {
		            if (this.readyState == 4 && this.status == 200)
		            {
		//                let jsonObject = JSON.parse( xhr.responseText );
		//                userId = jsonObject.id;

		//                if( userId > 0 )
		//                {
		                  document.getElementById("registerResult").innerHTML = "Your account has been created!";
		//                    return;
		//                }

		//                firstName = jsonObject.firstName;
		//                lastName = jsonObject.lastName;

		//                saveCookie();

		                  window.location.href = "index.html";
		            }
		        };
		        xhr.send(jsonPayload);
		    }
		    catch(err)
		    {
		        document.getElementById("registerResult").innerHTML = err.message;
		    }
		} else {
				document.getElementById("registerResult").innerHTML = "Looks like some of your info is missing!";
		}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let firstName = document.getElementById("newFirstName").value;
  let lastName = document.getElementById("newLastName").value;
  let email = document.getElementById("newEmail").value;
  let phone = document.getElementById("newPhone").value;

	document.getElementById("colorAddResult").innerHTML = "";

	if (firstName!="" && lastName!="" && email!="" && phone!="") {
	  let tmp = {user:userId, firstName:firstName, lastName:lastName, email:email, phone:phone};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					document.getElementById("colorAddResult").innerHTML = "Contact has been added";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("colorAddResult").innerHTML = err.message;
		}
	} else {
		document.getElementById("colorAddResult").innerHTML = "Looks like some contact info is missing!";
	}

}


function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let colorList = "";

	let tmp = {search:srch,user:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );


				// This section takes care of formatting the HTML for the contacts list
				let contactslistelement = document.getElementById("colorList");
				// .appendChild(document.createElement("div"));
				// contactslistelement.setAttribute("class", "contactslist");

				let e = document.querySelector('#colorList');

				var child = e.firstChild;

				// This section clears contact list before every search
				while (child) {
						e.removeChild(child);
						child = e.firstChild;
				 }

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					let  contactelement = contactslistelement.appendChild(document.createElement("div"));
					contactelement.setAttribute("style", "width: 1200px; float:left; height:100px; margin:10px");
					contactelement.setAttribute("id", "contact"+i);
					contactelement.setAttribute("class", "contact");

					let  firstnameelement = contactelement.appendChild(document.createElement("div"));
					firstnameelement.setAttribute("style", "width: 200px; float:left; height:50px; margin:10px");
					// firstnameelement.setAttribute("style", "width: 200px; float:left; height:50px; background:CYAN; margin:10px");
					firstnameelement.setAttribute("id", "firstName");
          firstnameelement.innerHTML = jsonObject.results[i].first_name;

					let  lastnameelement = contactelement.appendChild(document.createElement("div"));
					lastnameelement.setAttribute("style", "width: 200px; float:left; height:50px; margin:10px");
					lastnameelement.setAttribute("id", "lastName");
					lastnameelement.innerHTML = jsonObject.results[i].last_name;

          let  emailelement = contactelement.appendChild(document.createElement("div"));
					emailelement.setAttribute("style", "width: 450px; float:left; height:50px; margin:10px");
					emailelement.setAttribute("id", "email");
          emailelement.innerHTML = jsonObject.results[i].email;

					let  phoneelement = contactelement.appendChild(document.createElement("div"));
					phoneelement.setAttribute("style", "width: 200px; float:left; height:50px; margin:10px");
					phoneelement.setAttribute("id", "phone");
					phoneelement.innerHTML = jsonObject.results[i].phone;
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}
