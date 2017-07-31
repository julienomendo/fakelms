/**
 * @author gillesr
 */
var Scorm12Tracking = {
	apiHandle	 :	null,
	findAPITries :  0,
	noAPIFound	 : false,
	entry               : "ab-initio"
};
	
Scorm12Tracking.startTracking=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSInitialize("");
		this.entry = api.LMSGetValue("cmi.core.entry");
	}
};
	
Scorm12Tracking.stopTracking=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSFinish("");
		//document.location = '../../main/newscorm/lp_controller.php?action=stats';
	}
};
	
Scorm12Tracking.getUserName=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		return api.LMSGetValue("cmi.core.student_name");
	}
	return "";
};
	
Scorm12Tracking.getBookmark=function(){
	var api = this.getAPIHandle();
	if((this.entry == "resume")&&(!this.noAPIFound)){
		return api.LMSGetValue("cmi.core.lesson_location");
	}
	return "";
};
	
Scorm12Tracking.setBookmark=function(loc){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSSetValue("cmi.core.lesson_location", loc);
	}
};
	
Scorm12Tracking.getSuccesStatus=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		return api.LMSGetValue("cmi.core.lesson_status");
	}
	return "";
};
	
Scorm12Tracking.setSuccesStatus=function(status){
};
	
Scorm12Tracking.getCompletionStatus=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		return api.LMSGetValue("cmi.core.lesson_status");
	}
	return "";
};
	
Scorm12Tracking.setCompletionStatus=function(status){
	status =(status=="100") ? "completed" : "incomplete";
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSSetValue("cmi.core.lesson_status", status);
		if(status == "completed"){
			api.LMSSetValue("cmi.core.exit", "");
		}else{
			api.LMSSetValue("cmi.core.exit", "suspend");
		}
	}
};
	
Scorm12Tracking.getScore=function(){
	var api = this.getAPIHandle();
	if((this.entry == "resume")&&(!this.noAPIFound)){
		return api.LMSGetValue("cmi.core.score.raw");
	}
	return 0;
};
	
Scorm12Tracking.setScore=function(score){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSSetValue("cmi.core.score.raw", score);
		api.LMSSetValue("cmi.core.score.max", 100);
		api.LMSSetValue("cmi.core.score.min", 0);
	}
};
	
Scorm12Tracking.getSuspendData=function(){
	var api = this.getAPIHandle();
	if((this.entry == "resume")&&(!this.noAPIFound)){
		return api.LMSGetValue("cmi.suspend_data");
	}
	return "";
};
	
Scorm12Tracking.setSuspendData=function(sdata){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSSetValue("cmi.suspend_data", sdata);
	}
};
	
Scorm12Tracking.setSessionTime=function(ts){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.LMSSetValue("cmi.core.session_time", ts);
	}
};
	
// fonctions utiles
Scorm12Tracking.formatTime=function(ts){
	var sec = (ts % 60);
	ts -= sec;
	var tmp = (ts % 3600);  //# of seconds in the total # of minutes
	ts -= tmp;              //# of seconds in the total # of hours

	// convert seconds to conform to CMITimespan type (e.g. SS.00)
	sec = Math.round(sec*100)/100;
  
	var strSec = new String(sec);
	var strWholeSec = strSec;
	var strFractionSec = "";
	if (strSec.indexOf(".") != -1)
	{
		strWholeSec =  strSec.substring(0, strSec.indexOf("."));
		strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
	}
  
	if (strWholeSec.length < 2)
	{
		strWholeSec = "0" + strWholeSec;
	}
	strSec = strWholeSec;
  
	if (strFractionSec.length)
	{
		strSec = strSec+ "." + strFractionSec;
	}

	if ((ts % 3600) != 0 )
		var hour = 0;
	else var hour = (ts / 3600);
	if ( (tmp % 60) != 0 )
		var min = 0;
	else var min = (tmp / 60);

	if ((new String(hour)).length < 2)
		hour = "0"+hour;
	if ((new String(min)).length < 2)
		min = "0"+min;

	var rtnVal = hour+":"+min+":"+strSec;

	return rtnVal;
};
	
// gestion API scorm 1.2
Scorm12Tracking.findAPI=function( win ){
	var theAPI=null;
	while ((win.API == null) &&(win.parent != null) &&(win.parent != win) ){
		this.findAPITries++;
		if ( this.findAPITries > 500 ){
			alert( "Error finding API -- too deeply nested." );
			return null;
		}
		win = win.parent;
	}
	if(win.API != null){
		theAPI=win.API;
	}
	return theAPI;
};
	
Scorm12Tracking.getAPI=function()
{
	var theAPI = this.findAPI(window);
	if ( (theAPI == null) &&(window.opener != null) &&(typeof(window.opener) != "undefined") )
	{
		theAPI = this.findAPI( window.opener );
	}
	if (theAPI == null){
		alert( "Unable to locate the LMS's API Implementation.\n" + "Communication with the LMS will not occur." );
		this.noAPIFound = true;
	}
	return theAPI;
};
	
Scorm12Tracking.getAPIHandle=function()
{
	if (this.apiHandle == null){
		if (this.noAPIFound == false){
			this.apiHandle = this.getAPI();
		}
	}
	return this.apiHandle;
};
