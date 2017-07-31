/**
 * @author gillesr
 */
var Scorm2004Tracking = {
	apiHandle	 :	null,
	findAPITries :  0,
	noAPIFound	 : false,
	entry               : "ab_initio"
};
	
Scorm2004Tracking.startTracking=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.Initialize("");
		this.entry = api.GetValue("cmi.entry");
	}
};
	
Scorm2004Tracking.stopTracking=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.Terminate("");
	}
};
	
Scorm2004Tracking.getUserName=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		return api.GetValue("cmi.learner_name");
	}
	return "";
};
	
Scorm2004Tracking.getBookmark=function(){
	var api = this.getAPIHandle();
	if((this.entry == "resume")&&(!this.noAPIFound)){
		return api.GetValue("cmi.location");
	}
	return "";
};
	
Scorm2004Tracking.setBookmark=function(loc){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.SetValue("cmi.location", loc);
	}
};
	
Scorm2004Tracking.getSuccesStatus=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		return api.GetValue("cmi.success_status");
	}
	return "";
};
	
Scorm2004Tracking.setSuccesStatus=function(status){
};
	
Scorm2004Tracking.getCompletionStatus=function(){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		return api.GetValue("cmi.completion_status");
	}
	return "";
};
	
Scorm2004Tracking.setCompletionStatus=function(status){
	status =(status=="100") ? "completed" : "incomplete";
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.SetValue("cmi.completion_status", status);
		if(status == "completed"){
			api.SetValue("cmi.exit", "");
		}else{
			api.SetValue("cmi.exit", "suspend");
		}
	}
};
	
Scorm2004Tracking.getScore=function(){
	var api = this.getAPIHandle();
	if((this.entry == "resume")&&(!this.noAPIFound)){
		return api.GetValue("cmi.score.raw");
	}
	return 0;
};
	
Scorm2004Tracking.setScore=function(score){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.SetValue("cmi.score.raw", score);
		api.SetValue("cmi.score.max", 100);
		api.SetValue("cmi.score.min", 0);
	}
};
	
Scorm2004Tracking.getSuspendData=function(){
	var api = this.getAPIHandle();
	if((this.entry == "resume")&&(!this.noAPIFound)){
		return api.GetValue("cmi.suspend_data");
	}
	return "";
};
	
Scorm2004Tracking.setSuspendData=function(sdata){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.SetValue("cmi.suspend_data", sdata);
	}
};
	
Scorm2004Tracking.setSessionTime=function(ts){
	var api = this.getAPIHandle();
	if(!this.noAPIFound){
		api.SetValue("cmi.session_time", ts);
	}
};
	
// fonctions utiles
Scorm2004Tracking.formatTime=function(ts){
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

	var rtnVal = "PT"+hour+"H"+min+"M"+strSec+"S";

	return rtnVal;
};
	
// gestion API scorm 2004
Scorm2004Tracking.findAPI=function( win ){
	var theAPI=null;
	while ((win.API_1484_11 == null) &&(win.parent != null) &&(win.parent != win) ){
		this.findAPITries++;
		if ( this.findAPITries > 500 ){
			alert( "Error finding API -- too deeply nested." );
			return null;
		}
		win = win.parent;
	}
	if(win.API_1484_11 != null){
		theAPI=win.API_1484_11;
	}
	return theAPI;
};
	
Scorm2004Tracking.getAPI=function()
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
	
Scorm2004Tracking.getAPIHandle=function()
{
	if (this.apiHandle == null){
		if (this.noAPIFound == false){
			this.apiHandle = this.getAPI();
		}
	}
	return this.apiHandle;
};