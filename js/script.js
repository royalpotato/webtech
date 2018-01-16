 // date variables
        var now = new Date();
        today = now.toISOString();

        var twoHoursLater = new Date(now.getTime() + (2 * 1000 * 60 * 60));
        twoHoursLater = twoHoursLater.toISOString();

        // Google api console clientID and apiKey 
        var clientId = '984709628164-4otm67adrs3qcopd68hsfbkv3t63dcue.apps.googleusercontent.com';
        var apiKey = 'AIzaSyA0GcycTid3Hm95O4jeS8B9vUE2Ne8UpFc';

        // enter the scope of current project (this API must be turned on in the Google console)
        var scopes = 'https://www.googleapis.com/auth/calendar';

        // OAuth2 functions
        function handleClientLoad() {
            gapi.client.setApiKey(apiKey);
            window.setTimeout(checkAuth, 1);
        }

        function checkAuth() {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
        }
        

        // show/hide the 'authorize' button, depending on application state
        function handleAuthResult(authResult) {
            var authorizeButton = document.getElementById('authorize-button');
            var eventButton = document.getElementById('btnCreateEvents');
            var resultPanel = document.getElementById('result-panel');
            var resultTitle = document.getElementById('result-title');

            if (authResult && !authResult.error) {
                authorizeButton.style.visibility = 'hidden'; 		// if authorized, hide button
                resultPanel.className = resultPanel.className.replace(/(?:^|\s)panel-danger(?!\S)/g, '')	// remove red class
                resultPanel.className += ' panel-success'; 			// add green class
                resultTitle.innerHTML = 'Application Authorized'		// display 'authorized' text
                eventButton.style.visibility = 'visible';
                $("#txtEventDetails").attr("visibility", "visible");
            } else {													// otherwise, show button
                authorizeButton.style.visibility = 'visible';
                $("#txtEventDetails").attr("visibility", "hidden");
                eventButton.style.visibility = 'hidden';
                resultPanel.className += ' panel-danger'; 			// make panel red
                authorizeButton.onclick = handleAuthClick; 			// setup function to handle button click
            }
        }

        // function triggered when user authorizes app
        function handleAuthClick(event) {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult);
            return false;
        }

        function refreshICalendarframe() {
            var iframe = document.getElementById('divifm')
            iframe.innerHTML = iframe.innerHTML;
        }
        // setup event details
        var resource = {
            "summary": "My Appointment",
			"start": {
                "dateTime": today
            },
            "end": {
                "dateTime": twoHoursLater
            },
            "description":"We are setting up an appointment",
            "location":"Bucharest",
            "attendees":[
			{
					"email":"robert.ene95@gmail.com",
					"displayName":"Robert",
					"organizer":true,
					"self":false,
					"resource":false,
					"optional":false,
					"responseStatus":"needsAction",
					"comment":"First Appointment",
					"additionalGuests":3
					
			}
			
			],
		};

        // function load the calendar api and make the api call
        function makeApiCall() {
            var eventResponse = document.getElementById('event-response');
           
            gapi.client.load('calendar', 'v3', function () {					// load the calendar api (version 3)
                var request = gapi.client.calendar.events.insert
                ({
                    'calendarId': 'cuiesvoolh9dpegi85j3njd8qo@group.calendar.google.com', // calendar ID
                    "resource": resource							// pass event details with api call
                });
                
                // handle the response from our api call
                request.execute(function (resp) {
                    if (resp.status == 'confirmed') {
                        alert(resp.status);
                        eventResponse.innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
                        eventResponse.className += ' panel-success';
                        refreshICalendarframe();
                    } else {
                        document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
                        eventResponse.className += ' panel-danger';
                    }
                });
            });
        }
        
		// FUNCTION TO DELETE EVENT
		//it does delelte the event, but it's gonna show the else message, don't know why
	   function deleteEvent() {
		 gapi.client.load('calendar', 'v3', function() {  
		   var request = gapi.client.calendar.events.delete({
			 'calendarId': 'cuiesvoolh9dpegi85j3njd8qo@group.calendar.google.com',
			 'eventId': 'jvraokr2qdb35vbrbg5dqbi060'
		   });
		 request.execute(function(resp) {
				refreshICalendarframe();
		
		 });
		 });
	   } 
	   
	   // READ records 
	   function readRecords() {     $.get("/events/", {}, function (data, status) {         data.forEach(function(value) {             var row = '<tr id="row_id_'+ value.id +'">'                + displayColumns(value)             + '</tr>';             $('#events').append(row);         });     }); } function displayColumns(value) {     return  '<td>'+value.id+'</td>'             + '<td class="title">'+value.title+'</td>'    + '<td class="abstract">'+value.abstract.substring(0,255)+' ...</td>'    + '<td class="authors">'+value.authors+'</td>'    + '<td align="center">'    + '<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'    + '</td>'    + '<td align="center">'    + '<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Exclude</button>'    + '</td>'; }
       function addRecord() {     $('#id').val('');     $('#title').val('');     $('#abstract').val('');     $('#authors').val('');     $('#keywords').val('');     $('#url').val('');     $('#myModalLabel').html('Add New Article');     $('#add_new_record_modal').modal('show'); }
       function viewRecord(id) 
       {     var url = "/events/" + id;     $.get(url, {}, function (data, status) 
       {//bind the values to the form fields
       $('#title').val(data.title);         $('#abstract').val(data.abstract);         $('#authors').val(data.authors);         $('#keywords').val(data.keywords);         $('#url').val(data.url);         $('#id').val(id);         $('#myModalLabel').html('Edit Article');         $('#add_new_record_modal').modal('show');     }); } 
       function saveRecord() {     var formData = $('#record_form').serializeObject();     if(formData.id) {         updateRecord(formData);     } else {         createRecord(formData);     } } function createRecord(formData) {     $.ajax({         url: '/evennts/',         type: 'POST',         accepts: {             json: 'application/json' },        data: formData,         success: function(data) {             $('#add_new_record_modal').modal('hide');             var row = '<tr id="row_id_'+ data.id +'">'                + displayColumns(data)             + '</tr>';             $('#events').append(row); }     }); } function updateRecord(formData) {     $.ajax({         url: '/events/'+formData.id,         type: 'PUT',         accepts: {             json: 'application/json' },data: formData,         success: function(data) { $('#row_id_'+formData.id+'>td.title').html(formData.title); $('#row_id_'+formData.id+'>td.abstract').html(formData.abstract.substring(0,255)+' ...'); $('#row_id_'+formData.id+'>td.authors').html(formData.authors);             $('#add_new_record_modal').modal('hide'); }     }); }
       function deleteRecord(id) {     $.ajax({         url: '/events/'+id,         type: 'DELETE',         success: function(data) {             $('#row_id_'+id).remove();         }     }); }
       $.fn.serializeObject = function() {     var o = {};     var a = this.serializeArray();     $.each(a, function() {         if (o[this.name] !== undefined) {             if (!o[this.name].push) {                 o[this.name] = [o[this.name]];             }             o[this.name].push(this.value || '');         } else {             o[this.name] = this.value || '';         }     });     return o; };