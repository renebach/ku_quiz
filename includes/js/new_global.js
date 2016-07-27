// ===================================================================
// ============================== INIT ===============================
// ===================================================================
window.addEvent('domready', function(){
if($('toggle')) {
$('toggle').addEvent('click', function(e) {
	e.preventDefault();
	var myParent = this.getParent('nav');
if($(myParent).hasClass('open')) {
	$(myParent).addClass('closing');
	$(myParent).removeClass('open');
	setTimeout(function(){$(myParent).removeClass("closing")},450);
	} else { $(myParent).addClass('open')};
} );
}
	webAppLinks();
	
	// view event information 
if($('tt_builder')) {
	var itemArray = $$('li.action_link a');
	itemArray.each(function(el) {el.addEvent('click', showPartAction);});
	if ($$('#home_screen_box .closeIcon')) {
	var itemArray = $$('#home_screen_box .closeIcon');
	itemArray.each(function(el) {el.addEvent('click', homeScreenAd);});
	}
}


if($('tt_builder')) {
if($$('#builder_step_two select[class~=dd_check]')) {
	var eventArray = $$('#builder_step_two select[class~=dd_check]');
	eventArray.each(function(el) {el.addEvent('change', chkTwoHour);});
 }
}
 	hideFields();
	
});
  // FUNCTIONS
// ===================================================================
// WebApp Check 
//Ensure links stays within App and not 'pop-out' to safari
// ===================================================================
  var webAppLinks = function() {
 if(("standalone" in window.navigator) && window.navigator.standalone){
    var noddy, remotes = false;
    document.addEventListener('click', function(event) {
    noddy = event.target;
    while(noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
    noddy = noddy.parentNode;
    }
    if('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes))
    {
    event.preventDefault();
    document.location.href = noddy.href;
    }
    },false);
    }
  };

// ===================================================================
// Dropdown TWO hour check / disable next select
// Select on Builder step two 
// ===================================================================
  var chkTwoHour = function(event) {
	  event.stop();
	  var myObject = this;
					 var case_id = myObject.get("id");
					 var select_value = $(case_id).value;
					 var NextSelect = case_id.split("_0"); NextSelect = +NextSelect[1].toInt()+1;
					 var NextSelectId = 'time_slot_0'+NextSelect;
					 $(NextSelectId).set('disabled', false);
		var req = new Request({
			method: 'post',
			onComplete: function(response) {
					if(response == 1) {  $(NextSelectId).set('disabled', true)};
				},
				url: 'actions/chkTwoHour.php',
				data: { 'ref' : select_value}
				}).send();
  };
  
  // ===================================================================
// Dropdown TWO hour check / disable next select
// Select on Builder step two 
// ===================================================================
  var homeScreenAd = function(event) {
	  event.stop();
	  var myObject = this;
					 var getHref = myObject.get("href");
					 var getHref = getHref.split("?i=");
					 var case_id = getHref[1];
					 var myLink = getHref[0];
		var req = new Request({
			method: 'post',
			onComplete: function(response) {
					if(response == 1) {  $('home_screen_box').destroy()} else { alert('hep hep');};
				},
				url: myLink,
				data: { 'ref' : case_id}
				}).send();
  };
  
  
// ===================================================================
// Input 'Enter' hijack  
//Ensure clicking enter don't default to submit form
// ===================================================================
   var nextInput = function() {
	   var inputs = $$('input,textarea, select');
inputs.each(function(el,i){
    el.addEvent('keypress',function(e) {
        if(e.key == 'enter'){
            e.stop();
            var next = inputs[i+1];
            if (next){ 
                next.focus();
            }
            else {
                // inputs[0].focus(); or form.submit() etc.
            }
        }
    });
});
	   
   }

// ===================================================================
// Show and hide areas
// By clicking checkboxes, radio or text
// ===================================================================
   var hideFields = function() {
var myFieldId	=	new Array("disb_check"); // matching pairs w/myHiddenFields
var myHiddenFields	=	new Array("toggle_other"); 
var fieldType	=	new Array('checkbox'); 
var fieldRequest	=	new Array('disb_info'); 
myFieldId.each(function(el, index) {
							var myDiv = myHiddenFields[index];
							var myType = fieldType[index];
							var myRequest = fieldRequest[index];
							if ($(el)) {$(el).addEvent('click', function(){showField(this,myDiv,myType, myRequest);}); }
							
							   });
myHiddenFields.each(function(el, index) {
							var myCheck = myFieldId[index];
							var myRequest = fieldRequest[index];
							if ($(el)) { 
							var newToggle = el+"_"+index;
var newToggle =  new Fx.Slide(el,{ duration: 1000, transition: 'bounce:out'});
if($(myCheck).checked){ if ($(myRequest)) {reqItems.include(myRequest);}
} else {if ($(myRequest)) {reqItems.erase(myRequest);} newToggle.hide();}


}
							   });
}

var showField = function(e, div, type, r) {	
	var toggleField =  new Fx.Slide(div,{ duration: 1000, transition: 'bounce:out'});
	if(type == 'checkbox') {
	if($(e).checked){
		if ($(r)) {reqItems.include(r);};
		toggleField.slideIn();} else {if ($(r)) {reqItems.erase(r);};
		toggleField.slideOut();}
	} else { 
	var div_title = $(e).get('html');
	if(div_title == 'view') { $(e).set('html', 'close')}	
	if(div_title == 'close') { $(e).set('html', 'view')}
	toggleField.toggle(); }
	   
}
// ===================================================================
// CMT SETTINGS
// add / show
// edit + delete
// ===================================================================

  var showAction = function(event) {
	  event.stop();
	  var myObject = this;
					 var getHref = myObject.get("href");
					 var getHref = getHref.split("?i=");
					 var case_id = getHref[1];
					 var myLink = getHref[0];
					 //alert(myLink+' :: '+case_id);
					 //throw'';
		var req = new Request({
			method: 'post',
			onComplete: function(response) {
				createSection(response, case_id, myObject);
				},
				url: 'md/'+myLink,
				data: { 'ref' : case_id}
				}).send();
	
 }
 
  
   var hideSection = function(div) {
	var toogleField = new Fx.Reveal($(div), {duration: 1000, mode: 'vertical', transition: Fx.Transitions.Pow.easeOut, onComplete: function(){
	$(div).destroy();
    }});
	toogleField.dissolve();
 }
 
var createSection= function(r, i, obj) {
	var myParent = obj.getParent('section.section_group');
	var parentDiv = myParent.get('id');
	var blockId = 'update_'+parentDiv;
				if(!$(blockId)){
					var newElement = new Element('div', {
											 'class': 'caseDetailBlock',
											 'html': r,
											 'id': blockId
											 });
					newElement.inject($(parentDiv), 'before');
					} else 	{$(blockId).set('html', r);}
	$(blockId).hide();
	if($('reqFields')) { //get required items
		 var newRequired = $('reqFields').value;
		 var requestItems = newRequired.split(" ");
		 };
	var toogleField = new Fx.Reveal($(blockId), {duration: 1000, mode: 'vertical', transition: Fx.Transitions.Pow.easeOut, onComplete: function(){
	var cancelButton = $(blockId).getElements('a.cancelBtn'); var closeIcon = $(blockId).getElements('aside.sectionIcon a.closeIcon');
	closeIcon.combine(cancelButton);
	closeIcon.each(function(el) {el.addEvent('click', function(event) {event.stop();hideSection(blockId);});});
	// activate submit button
	 var submitButton = $(blockId).getElements('a.submitBtn');
	 submitButton.each(function(cont) {cont.addEvent('click', function(event) {
																	   event.stop();
																	   var formId = cont.getParent('form').id;
																	   updateCaseForm(formId, blockId, requestItems);
																			 });});
    }});
	toogleField.reveal();
	
}

var sectionHighlight = function(div) {
	$(div).setStyles({
    'animation': 'highlight 4s 1',
    'animation-delay': '0.2s'
});
	removeHighlight.delay(4200, div);

}

var removeHighlight = function() {
	$(this).removeProperty('style');

}

var updateCaseForm = function (formId, div, required) {
	var myForm = $(formId);
	var mySection = $(div);
	myLink = myForm.get('action');
	if($('reqFields')) { var isValid = validateMe(required); if(isValid==false) { throw'';};
	} 
    new Request({
		method: myForm.get('method'),
		url: 'md/'+myLink,
        data: myForm,
        onComplete: function(response){
			//alert(myLink); alert(response); throw'';
		var myResponse = response;
			var myParentSection = mySection.getNext('section.section_group');
			hideSection(div);
			//highlight -> add class or keyframe animation - grey block
			$(myParentSection).set('html', myResponse);
			sectionHighlight(myParentSection);
			//activate + button (showaction) inside myParentSection
	var itemArray = $$('section.section_group aside a');
	itemArray.each(function(el) {el.addEvent('click', showAction);});
			}
    }).send();  
	  
  }

// ===================================================================
// Event Add/Remove student from event
// ===================================================================
   var addTick = function() {
$$('table.listview a[class$=register]').each(function(el) {
		el.addEvent('click',function(event) {
				   event.preventDefault(); //alert('hep'); throw'';
				   this.addClass('confirm');
				   el.removeEvents('click');
		el.addEvent('click',function(event) {
					 event.preventDefault();
					 var myHref = el.get('href');
					 var getRef = myHref.split("?ref=");
					 var myLink = getRef[0];
					 var splitRef = getRef[1];
					var getEvent = splitRef.split("&e=");
					 var myRef = getEvent[0];
					 var myEvent = getEvent[1];
					//alert(myLink+' :: '+myRef+' :: '+myEvent); throw'';
					 var req = new Request({
							  method: 'post',
							  onComplete: function(response) {
								  el.removeClass('confirm');
								  el.removeClass('register'); el.addClass('attended');
								  el.set('title', response);
								  el.removeEvents('click');
								  removeTick();},
								  url: myLink,
								  data: { 'ref' : myRef, 'e' : myEvent, 'd' : 1 }
								  }).send();
					});
		});
		
		});
}

 var removeTick = function() {
$$('table.listview a[class$=attended]').each(function(el) {
		el.addEvent('click',function(event) {
				   event.preventDefault();
				   this.addClass('confirm');
				   el.removeEvents('click');
		el.addEvent('click',function(event) {
					 event.preventDefault();
					 var myHref = el.get('href');
					 var getRef = myHref.split("?ref=");
					 var myLink = getRef[0];
					 var splitRef = getRef[1];
					var getEvent = splitRef.split("&e=");
					 var myRef = getEvent[0];
					 var myEvent = getEvent[1];
					 //alert(myLink+' :: '+myRef+' :: '+myEvent); throw'';
					 var req = new Request({
							  method: 'post',
							  onComplete: function(response) {
								  el.removeClass('confirm');
								  el.removeClass('attended'); el.addClass('register');
								  el.set('title', response);
								  el.removeEvents('click');
								  addTick();
								  },
								  url: myLink,
								  data: { 'ref' : myRef, 'e' : myEvent, 'd' : 0 }
								  }).send();
					});
		});
	});
}

// ===================================================================
// PARTICIPANTS  section
// ===================================================================

  var showPartAction = function(event) {
	  event.stop();
	  var myObject = this;
					 var getHref = myObject.get("href");
					 var getHref = getHref.split("?i=");
					 var case_id = getHref[1];
					 var myLink = getHref[0];
	//alert(myLink+' :: '+case_id); throw'';
		var req = new Request({
			method: 'post',
			onComplete: function(response) {
				createPartSection(response, case_id, myObject);
				},
				url: '../actions/'+myLink,
				data: { 'ref' : case_id}
				}).send();
	
 }
 
  
   var hidePartSection = function(d) {
	var hideField = new Fx.Reveal($(d), {duration: 1000, mode: 'vertical', transition: Fx.Transitions.Pow.easeOut, onComplete: function(){
	//$(div).destroy();
    }});
	hideField.dissolve();
 }
 
var createPartSection= function(r, i, obj) {
	var myParent = obj.getParent('div.app_block');
	var parentDiv = myParent.get('id'); 
	var blockId = 'update_'+parentDiv;
	//alert('hello'); throw'';
				if(!$(blockId)){
					var newElement = new Element('div', {
											 'class': 'caseDetailBlock',
											 'html': r,
											 'id': blockId
											 });
					newElement.inject($(parentDiv), 'after');
					} else 	{$(blockId).set('html', r);}
	$(blockId).hide();
	if($('reqFields')) { //get required items
		 var newRequired = $('reqFields').value;
		 var requestItems = newRequired.split(" ");
		 };
	$(blockId).setStyle('background', '#FFF');
	var cancelButton = $(blockId).getElements('a.cancelBtn'); var closeIcon = $(blockId).getElements('aside.sectionIcon a.closeIcon');
	closeIcon.combine(cancelButton);
	closeIcon.each(function(el) {el.addEvent('click', function(event) {event.stop();hidePartSection(blockId);});});
	var toogleField = new Fx.Reveal($(blockId), {duration: 1000, mode: 'vertical', transition: Fx.Transitions.Pow.easeOut, onComplete: function(){
	// activate submit button
	if($('continue')) { 
	 var submitButton = $(blockId).getElements('a.submitBtn'); 
	 submitButton.each(function(cont) {cont.addEvent('click', function(event) {
																	   event.stop();
																	   var formId = cont.getParent('form').id;
																	   updatePartForm(formId, blockId, requestItems);
																			 });});
	}
    }});
	toogleField.reveal();
	
}

var updatePartForm = function (formId, div, required) {
	var myForm = $(formId);
	var mySection = $(div);
	myLink = myForm.get('action');
	var isValid = validateMe(required);
	if(isValid==false) {	 throw'';};
	 //alert('Wow I am ready to go!');	throw''; 
    new Request({
		method: myForm.get('method'),
		url: 'md/'+myLink,
        data: myForm,
        onComplete: function(response){
			
		var myFirst = response;
		//alert(response); throw '';
			hidePartSection(div);
			//highlight -> add class or keyframe animation - grey block
			var myParentSection = div.replace('update_','');
			$(myParentSection).set('html', myFirst);
			sectionHighlight(myParentSection);
			//activate + button (showaction) inside myParentSection
	var itemArray = $$('#'+myParentSection+' li.action_link a');
	itemArray.each(function(el) {el.addEvent('click', showPartAction);});
			}
    }).send();  
	  
  }
// ===================================================================
// VALIDATE
// ===================================================================
// ===================================================================
function validate_email(e){
var txtFilter =  /^[a-zA-Z0-9\.+=_–-]+@[a-zA-Z0-9_–-]+(\.[a-zA-Z0-9_–-]{2,12})+$/;
// var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
var thisField = $(e).get('value');
if (!(thisField.match(txtFilter)))
	  {
		  if(!$(e+'_warning')){showWarning(e, 'Please provide a valid email','after');}
		  $(e).addClass('req_field');
	   return false}
	else{
	$(e).removeClass('req_field');
		 if($(e+'_warning')){$(e+'_warning').destroy();};
		return true;}
}

function validateMe(reqItems) {
			var inputFields = Array.clone(reqItems);
			var emptyFields = new Array();
			var specialFields = new Array('chk_site');
			var emailFields = new Array('contact_mail');
			var blankRE=/^\s*$/; //regular expression  rule to catch blank input fields incl with empty spaces

			for (i=0;i<inputFields.length;i++)
	{
	var formElement = inputFields[i];
			if(specialFields.contains(formElement)) {
				$$('input[name^='+formElement+']').map(function(e) {
			var parentClass = e.getParent('label.block-label');
			$(parentClass).removeClass('req_field');
			});

	var inputValue = $$('input[name^='+formElement+']:checked').map(function(e) {return e.value;});
		} else {
	var inputValue = $(formElement).get('value');
	$(formElement).removeClass('req_field');
	}
	if(emailFields.contains(formElement)) {
			if(!validate_email(formElement)) emptyFields.push(formElement);
		}
			
	if(blankRE.test(inputValue)){
			emptyFields.push(formElement);
		}
			
	
}
	if (emptyFields.length >0) {
	emptyFields.each(function(item, index){
			if(specialFields.contains(item)) { 
								   $$('input[name^='+item+']').map(function(e) {
											var parentClass = e.getParent('label.block-label');
											 $(parentClass).addClass('req_field');
											 });
							  } else {
	$(item).addClass('req_field');
							  }
});
	
	
	if($('icons_warning')){	$('icons_warning').destroy();}
	showWarning("icons", "Please fill out highlighted fields above. Thank you");
	return false;
	} else {
		 if($('icons_warning')){$('icons_warning').destroy();};
	}
}

// Show Warning using mootools library
var showWarning = function (e, warning, location) {
	var button	 = '<div class="highlight_warning"><span>'+warning+'</span></div><br/>';
	var newElement = new Element('div', {
    'class': 'warning_block',
    'html': button,
    'styles': {
        'display': 'block'
    },
    'id': $(e).id+'_warning'
	}
) ;

	newElement.inject($(e), location);
}

var removeWarning = function() {
	$(this).destroy();

}

// Show Warning using mootools library
var newDiv = function(e) {
showWarning( "add_new_event", e, 'before');
			var newElementID = 'add_new_event_warning'
			var myFx_top = new Fx.Tween($(newElementID), {  link: 'chain', property: 'opacity' });
			myFx_top.set(0).start(1).wait(3200).start(0);
			removeWarning.delay(4200, newElementID);
};

var eventTick = function(e) {
showWarning( "event_list", e, 'before');
			var newElementID = 'event_list_warning'
			var myFx_top = new Fx.Tween($(newElementID), {  link: 'chain', property: 'opacity' });
			myFx_top.set(0).start(1).wait(3200).start(0);
			removeWarning.delay(4200, newElementID);
};