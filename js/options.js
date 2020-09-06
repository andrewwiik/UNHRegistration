// chrome.storage.sync.set({ "yourBody": "myBody" }, function(){
//     //  A data saved callback omg so fancy
// });

// chrome.storage.sync.get(/* String or Array */["yourBody"], function(items){
//     //  items = [ { "yourBody": "myBody" } ]
// });


function loadData(cb) {
	chrome.storage.sync.get(/* String or Array */["unhClassRegistrationData"], function(items){
    //  items = [ { "yourBody": "myBody" } ]
    if (items['unhClassRegistrationData']) {
    	let jsonDataString = items["unhClassRegistrationData"];
    	let jsonData = JSON.parse(jsonDataString);
    	cb(jsonData);
    } else {
    	cb({});
    }
	});
}


function saveData(jsonObj) {
	let jsonDataString = JSON.stringify(jsonObj);
	chrome.storage.sync.set({ "unhClassRegistrationData": jsonDataString }, function(){
	    //  A data saved callback omg so fancy
	    if(chrome.runtime.lastError) {
	    	let sucessStr = '<div class="alert alert-danger"><strong>Failure!</strong> Settings Could not Be Saved</div>';
	    	$( "#statusContainer" ).html(sucessStr);
	    } else {
	    	let sucessStr = '<div class="alert alert-success"><strong>Success!</strong> Settings Saved</div>';
	    	$( "#statusContainer" ).html(sucessStr);
	    }
	});

}

function saveSettings() {
	console.log('Saving Form');
	// let data = $('#settings').serializeArray();
	// //data['crns'] = $("#crns").tagsinput('items');
	// console.log(data);

	let form = document.getElementById('settings') || document.querySelector('form[name="settings"]');
	//console.log(form);
	let jsonData = Array.from(new FormData(form)).map(function(e,i) {this[e[0]]=e[1]; return this;}.bind({}))[0];
	jsonData['crns'] = $("#crns").tagsinput('items');
	saveData(jsonData);
}

loadData(function(jsonData) {
	for (let objKey in jsonData) {
		if (jsonData.hasOwnProperty(objKey)) {
			let beginQuery = 'input';
			let inputValue = jsonData[objKey];

			if (Array.isArray(inputValue)) {
				beginQuery = 'select';
			}

			let formInputQuery = beginQuery + '[name="' + String(objKey) + '"]';
			let formInput = $(formInputQuery);

			if (Array.isArray(inputValue)) {
				$(formInput).tagsinput('refresh');
				for (let value of inputValue) {
					$(formInput).tagsinput('add', value);
				}
				$(formInput).tagsinput('refresh');
			} else {
				formInput.val(inputValue);
			}
		}
	}
})

let submitButton = document.getElementById("submitSettings");
if (submitButton) {
	submitButton.addEventListener("click", saveSettings);
}