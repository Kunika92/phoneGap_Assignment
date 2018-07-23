			if(localStorage.arrContacts){
				var arrContacts = JSON.parse(localStorage.arrContacts);
			}
			else{
				var arrContacts = [];
			}

			function addContact() {
				$.mobile.changePage( "#home", { transition: "slidefade", changeHash: false });
			}

			function saveEntry() {
				var name = document.getElementById('name');
				var contactNo = document.getElementById('contactNo');
				var email = document.getElementById('email');

				var contact = {name:name.value, contactNo: contactNo.value, email: email.value}
				// console.log(contact);
				arrContacts.push(contact);
				// console.log(arrContacts);

				localStorage.arrContacts = JSON.stringify(arrContacts);
				showEntries();
				$('#success').css("display","block");
				$.mobile.changePage( "#contactList", { transition: "slidefade", changeHash: false });
				
				$('#addContactForm')[0].reset();

				// $("body").pagecontainer("change", "contactList",{reloadPage: true});
			}

			function showEntries() {
				$.mobile.changePage( "#contactList", { transition: "slidefade", changeHash: false });

				var contList = document.getElementById('contList');
				// console.log(arrContacts);
				contList.innerHTML = "";

				for (var i=0; i<arrContacts.length; i++) {	
					contList.innerHTML = contList.innerHTML+"<li><a href='#' onclick='contactDetails("+i+")'>"+arrContacts[i].name+"</a></li>";
				}	

				if ( $('#contList').hasClass('ui-listview')) {
				    $('#contList').listview('refresh');
				} 
				else {
				    $('#contList').trigger('create');
				}
			
			}

			function contactDetails(contactId) {
			    if (localStorage.getItem('arrContacts') !== null) {

			    	$.mobile.changePage( "#detailPage", { transition: "slidefade", changeHash: false });

			        var inputParse = JSON.parse(localStorage.getItem('arrContacts'));
			        // console.log(inputParse);
			        $.each(inputParse, function (id, text) {
			        	var contactHeading = document.getElementById('contactHeading');

			        	var conId = document.getElementById('conId');
			        	var contactName = document.getElementById('contactName');
			        	var contactNumber = document.getElementById('contactNumber');
			        	var contactEmail = document.getElementById('contactEmail');

			        	if (id === contactId) {
				            contactName.value = text['name'];
				            contactNumber.value = text['contactNo'];
				            contactEmail.value = text['email'];

				            contactHeading.innerHTML = text['name'];
				            conId.value = contactId
			        	}
			        });
			    }
			}

			function removeAll() {
				localStorage.clear();
				window.location.reload();
				showEntries();
			}

			function deleteContact() {
				var contactId = document.getElementById('conId').value;
				// console.log(contactId);
				arrContacts.splice(contactId, 1)
				localStorage.arrContacts = JSON.stringify(arrContacts);

				window.location.reload();
				showEntries();
			}
			

			var p = document.getElementById("paraId");
			var gMapHolder = document.getElementById("gMapHolder");

			function getLocation() {
				$.mobile.changePage( "#About", { transition: "slidefade", changeHash: false });

				// Check to see if HTML5 Geolocation is supported
				if(navigator.geolocation) {
					// Good to go
					p.innerText = "Good to Go";
					navigator.geolocation.getCurrentPosition(showPos, showErr, options);
				}
				else {
					// Not supported
					p.innerText = "Your browser does not support HTML5 Geolocation";
				}
			}

			// Called when location is saught
			function showPos(pos) {
				var lat = pos.coords.latitude;
				var lon = pos.coords.longitude;
				var acc = pos.coords.accuracy;

				var latLong = new google.maps.LatLng(lat, lon);

				var mapOptions = {
					center: latLong,
					zoom: 15,
					disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.TERRAIN
				}

				var myMap = new google.maps.Map(gMapHolder, mapOptions);
				var marker = new google.maps.Marker( {position:latLong, map:myMap, animation: google.maps.Animation.BOUNCE} );

				p.innerHTML = "Latitude: " + lat + "<br>Longitude: " + lon;
			}

			// Called when error
			function showErr(err) {
				p.innerHTML = "Error Code: " + err.code + " : " + err.message + "";
			}


			// Extra parameter for getCurrentPosition to make it more accurate
			var options = {
				enableHighAccuracy: true,
				timeout:5000
			}

			//Call this function on clicking add profile picture button at footer
			function getPicture() {
				console.log("hi");
			 	 var options = setOptions(Camera.PictureSourceType.PHOTOLIBRARY); // Camera.PictureSourceType.CAMERA
				 navigator.camera.getPicture(onSuccess, onFail,options);
			}


			function onSuccess(imageData) {

				var profilePicThumb = document.getElementById('profilePicThumb');
	   			profilePicThumb.src = imageData; // this element shows the image thumbnail on header

	   			var profilePicEnlarge = document.getElementById('profilePicEnlarge');
	   			profilePicEnlarge.src = imageData; // this element shows the enlarged image on the page
	   			

	   			// call the fileupload plugin
	   			var options = new FileUploadOptions();
				options.fileKey = "file";
				options.fileName = imageData.substr(imageData.lastIndexOf('/') + 1);
				options.mimeType = "text/plain";

	   			var ft = new FileTransfer();
	   			ft.upload(imageData, encodeURI("http://abendago.com/upload.php"), fileWin, onFail, options);
	   		}

			function fileWin() {
				alert("Image Uploaded Successfully! :)");
			}

			function onFail() {
				alert("Image Uploading Failed! :(");
			}

			function setOptions(srcType) {
			    var options = {
			        // Some common settings are 20, 50, and 100
			        quality: 50,
			        destinationType: Camera.DestinationType.FILE_URI,
			        // In this app, dynamically set the picture source, Camera or photo gallery
			        sourceType: srcType,
			        encodingType: Camera.EncodingType.JPEG,
			        mediaType: Camera.MediaType.PICTURE,
			        allowEdit: true,
			        correctOrientation: true  //Corrects Android orientation quirks
			    }
			    return options;
			}

			//to view the image in enlarged form
			$('viewImage').on( "click", function() {
			    $( ".photopopup" ).on({
			        popupbeforeposition: function() {
			            var maxHeight = $( window ).height() - 60 + "px";
			            $( ".photopopup img" ).css( "max-height", maxHeight );
			        }
			    });
			});