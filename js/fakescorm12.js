/**
 * Created by Julien on 31/07/2017.
 */
window.API = (function(){
	var data = {
		"cmi.core.student_id": "000000",
		"cmi.core.student_name": "Student, JulienSTIEN",
		"cmi.core.lesson_location": "",
		"cmi.core.lesson_status": "not attempted"
	};
	var customLog = function(title, message) {
		title = typeof title === 'undefined' ? '' : title;
		message = typeof message === 'undefined' ? '' : message;
		console.log(title +' :'+ message);
		$('#log').append('<br>'+title + ' :'+ message);
	};
	return {
		LMSInitialize: function() {
			console.log('INITIALIZATION OK');
			return "true";
		},
		LMSCommit: function() {
			var dataAlert = '';
			$.each(data, function(i,v){
				dataAlert += '<br>' + i + '->' + v;
			});
			customLog('Check', dataAlert);
			//alert('commit:\n' + dataAlert);
			return "true";
		},
		LMSFinish: function() {
			var dataAlert = '';
			$.each(data, function(i,v){
				dataAlert += '\n' + i + '->' + v;
			});
			customLog('FINISH', dataAlert);
			alert('Finish:\n' + dataAlert);
		},
		LMSGetValue: function(model) {
			customLog('LMSGetValue', model);
			return data[model] || "";
		},
		LMSSetValue: function(model, value) {
			data[model] = value;
			customLog('LMSSetValue', model + '->' + value);
			return "true";
		},
		LMSGetLastError: function() {
			//customLog('LMSGetLastError');
			return "0";
		},
		LMSGetErrorString: function(errorCode) {
			console.error('LMSGetErrorString :' + errorCode);
			return "No error";
		},
		LMSGetDiagnostic: function(errorCode) {
			console.error("LMSGetDiagnotisc", errorCode)
			return "No error";
		}
	};
})();