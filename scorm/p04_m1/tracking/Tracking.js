/**
 * @author gillesr
 */
 
var Tracking = {
	popUp                                  : false,
	norme                                  : "No",//permet de charger un fichier de tracking format: normeTracking.js
	LMS_connection_status  : 0,   //0 avant connexion, 1 connecté, 2 après connexion
	LMS_user_name                  : "Onyme, Anne",  
	LMS_bookmark                    : "", //marque-page
	LMS_suspend_data            : "", // données entre les sessions
	LMS_succes_status          : "unknown", // passed, failed, unknown
	LMS_completion_status  : "incomplete", //incomplete ou completed
	LMS_score			    : 0,//score en %
	entree				    : 0,
	sortie				    : 0,
	timeInSession		    : 0 //tps passé
};
	// fonctions de communication
	// démarrage de la session de communication
Tracking.startTracking=function(nrm){
		if(nrm!=undefined){
			this.norme = nrm;
		}
		eval(this.norme+"Tracking").startTracking();
		eval(this.norme+"Tracking").setSuccesStatus('incomplete');
		this.entree = new Date();
		this.entree = this.entree.getTime();
};

// fin de la session de communication	
Tracking.stopTracking=function(){
		eval(this.norme+"Tracking").stopTracking();
		if(this.popUp){
			window.close();
		}
		window.document.location.href = "tracking/goodbye.html";
};
		
// nom de l'apprenant
Tracking.getUserName=function(){
		return this.LMS_user_name;
};
	
	// gestion du marque page
Tracking.getBookmark=function(){
		return this.LMS_bookmark;
};
	
Tracking.setBookmark=function(bk){
	if((bk==undefined)||(bk=='undefined')){
		bk="";
	}
	this.LMS_bookmark = bk;
	eval(this.norme+"Tracking").setBookmark(bk);
};
	
// gestion du statut
Tracking.getSuccesStatus=function(){
	return this.LMS_succes_status;
};
	
Tracking.setSuccesStatus=function(succes){
	this.LMS_succes_status = succes;
	eval(this.norme+"Tracking").setSuccesStatus(succes);
};
	
Tracking.getCompletionStatus=function(){
	return this.LMS_completion_status;
};
	
Tracking.setCompletionStatus=function(comp){
	this.LMS_completion_status = (comp=="100") ? "completed" : "incomplete";
	eval(this.norme+"Tracking").setCompletionStatus(comp);
};
	
Tracking.getScore=function(){
	return this.LMS_score;
};
	
Tracking.setScore=function(score){
	this.LMS_score = score;
	eval(this.norme+"Tracking").setScore(score);
};
	
// gestion du suspend_data
Tracking.getSuspendData=function(){
	return "";//this.LMS_suspend_data;
};
	
Tracking.setSuspendData=function(suspend){
	this.LMS_suspend_data = "";//suspend;
	eval(this.norme+"Tracking").setSuspendData(suspend);
};
	
// gestion du temps
Tracking.getSessionTime=function(){
	this.sortie = new Date();
	this.sortie = this.sortie.getTime();
	this.timeInSession = Math.floor((this.sortie-this.entree)/1000);
	return eval(this.norme+"Tracking").formatTime(this.timeInSession);
};
	
Tracking.setSessionTime=function(){
	var tm= this.getSessionTime();
	eval(this.norme+"Tracking").setSessionTime(tm);
};
	
// fonctions utiles pour enregistrement/récupération de plusieurs infos en une seule fois
// à l'initialisation
Tracking.retrieveData=function(){
	//this.LMS_student_name		= eval(this.norme+"Tracking").getUserName();
	//this.LMS_bookmark 			= eval(this.norme+"Tracking").getBookmark();
	//this.LMS_succes_status		= eval(this.norme+"Tracking").getSuccesStatus();
	//this.LMS_completion_status	= eval(this.norme+"Tracking").getCompletionStatus();
	//this.LMS_suspend_data		= eval(this.norme+"Tracking").getSuspendData();
	//this.LMS_score				= eval(this.norme+"Tracking").getScore();
};
	
// envoi des infos
Tracking.sendData=function(bk, succes, comp, suspend, score){
	//eval(this.norme+"Tracking").setBookmark(bk);
	/*if((succes!="")&&(succes!="null")&&(succes!=undefined)){
		eval(this.norme+"Tracking").setSuccesStatus(succes);
	}*/
	if((comp!="")&&(comp!="null")&&(comp!=undefined)){
		eval(this.norme+"Tracking").setCompletionStatus(comp);
	}
	//eval(this.norme+"Tracking").setSuspendData(suspend);
	/*if((score!="")&&(score!="null")&&(score!=undefined)){
		eval(this.norme+"Tracking").setScore(score);
	}*/
	this.setSessionTime();
};
