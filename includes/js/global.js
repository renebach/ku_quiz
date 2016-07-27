// ===================================================================
// ============================== INIT ===============================
// ===================================================================
window.addEvent('domready', function(){
if ($('warning_top')) { $('warning_top').fade('hide');}
if ($('warning_btm')) { $('warning_btm').hide();}
//if($('faculty')) { $('faculty').addEvent('change', function(e) {getHostList(this);} );}
hideFields();

if ($('app_ref_search')) {
		$('app_ref_search').addEvent('click', function() {(this.value=='reference number') ? this.value = '': this.select();});
		$('app_ref_search').addEvent('blur', function() {if (this.value=='') this.value = 'reference number';});
		$('app_ref_search').addEvent('keydown', function(event) {if (event.key == 'enter') {event.preventDefault();if ($('app_ref_search').value=='') {alert("please enter reference number");} else {
var fieldValue = $('app_ref_search').get('value');
//alert('done and show me textarea: '+fieldValue);
getAppRef(fieldValue);
//$("search_notes").submit();
}}});
}


// step 3 
if($('inb_application')) {
	var itemArray = $$('a.action_link');
	itemArray.each(function(el) {el.addEvent('click', showAction);});
	}


	
});




  // FUNCTIONS
var hideFields = function() {
var myFieldId	=	new Array("disability_check"); // matching pairs w/myHiddenFields
var myHiddenFields	=	new Array("togglebox_01"); 
var fieldType	=	new Array('checkbox'); 
var fieldRequest	=	new Array('disability_info'); 
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
if($(myCheck).checked){ if ($(myRequest)) {requestItems.include(myRequest);}
} else {if ($(myRequest)) {requestItems.erase(myRequest);} newToggle.hide();}


}
							   });
}

var showField = function(e, div, type, r) {	
//if(!$(e).checked) {alert('yes yes I amclicked but not checked '+e.id+' now slide: '+div); }
	var toggleField =  new Fx.Slide(div,{ duration: 1000, transition: 'bounce:out'});
	if(type == 'checkbox') {
	if($(e).checked){
		if ($(r)) {requestItems.include(r);};
		toggleField.slideIn();} else {if ($(r)) {requestItems.erase(r);};
		toggleField.slideOut();}
	} else { 
	var div_title = $(e).get('html');
	if(div_title == 'view') { $(e).set('html', 'close')}	
	if(div_title == 'close') { $(e).set('html', 'view')}
	toggleField.toggle(); }
	   
}

var getClassSelection = function(value) {}

var getInstDetails = function(value) {}
var getAppRef = function(value) {
var appRefValue = value;
	appRefValue = appRefValue.trim();
	var req = new Request({
			method: 'post',
			url: '../includes/php/get-app-ref.php',
			data: { 'ref' : appRefValue},
			onComplete: function(response) {
//alert(response);
				if(!$('scholarship_div')){
				var newElement_statement = new Element('div', {'html': response, 'id': 'scholarship_div'});
				newElement_statement.inject($('app_ref_search_box'), 'after');
				var myInput_statement =  new Fx.Slide(newElement_statement,{ duration: 1000, transition: 'bounce:out'});myInput_statement.hide();
				myInput_statement.slideIn();
				} else 	{$('scholarship_div').set('html', response);}
				//remove event + add Newevent + change 'continue'-> 'Submit'
				if($('app_ref_num')) {
				$('getButton').set('html', 'Submit');
				$('getButton').removeEvents('click');
				$('getButton').addEvent('click',function(e) {e.preventDefault(); if(validateMe()!=false) {
																			  //alert('done and gone');
																			  $("ssa_scholarship").submit();
																			  }; });
				if ($$('.wordcount')) {activateWordCount();};
								   }
			}
		}).send();	
}
// ===================================================================
// Inbound Data Build 
// add / show
// edit + delete
// ===================================================================

  var showAction = function(event) {
	  event.stop();
	  
	  var myObject = this;
					 var getHref = myObject.get("href");
					 var getHref = getHref.split("?i=");
					 var ref_id = String(getHref[1]);
					 var myLink = getHref[0];
					 //alert(myLink+' :: '+ref_id);
					 //throw'';
		var req = new Request({
			method: 'post',
			onComplete: function(response) {
				
				createSection(response, ref_id, myObject);
				},
				url: 'actions/'+myLink,
				data: { 'ref' : ref_id}
				}).send();
	
 }
 
  
   var hideSection = function(div) {
	var toogleField = new Fx.Reveal($(div), {duration: 1000, mode: 'vertical', transition: Fx.Transitions.Pow.easeOut, onComplete: function(){
	if($(div)) { $(div).destroy();}
    }});
	toogleField.dissolve();
 }
 
var createSection= function(r, i, obj) {
	
	var myParent = obj.getParent('div.app_block');
	
	if(!$(myParent)){ var parentDiv = 'md_transcript';} else {var parentDiv = myParent.get('id');}
	
	//if(!$(parentDiv)){ parentDiv = 'md_transcript';}
					// alert(parentDiv+' :: '+r);
					 //throw'';
	
	var blockId = 'update_'+parentDiv;
	//var blockId = 'overview';
				if(!$(blockId)){
					var newElement = new Element('div', {
											 'class': 'caseDetailBlock',
											 'html': r,
											 'id': blockId
											 });
					newElement.inject($(parentDiv), 'bottom');
					} else 	{$(blockId).set('html', r);}
	$(blockId).hide();
	$(blockId).setStyle('background', '#FFF');
	var cancelButton = $(blockId).getElements('a.cancelBtn'); var closeIcon = $(blockId).getElements('aside.sectionIcon a.closeIcon');
	closeIcon.combine(cancelButton);
	closeIcon.each(function(el) {el.addEvent('click', function(event) {event.stop();hideSection(blockId);});});
	// activate submit button
	 var submitButton = $(blockId).getElements('a.submitBtn');
	 submitButton.each(function(cont) {cont.addEvent('click', function(event) {
																	   event.stop();
																	   var formId = cont.getParent('form').id;
																	   if(formId != 'add_file_form') {
																	   updateInbForm(formId, blockId);
																	   } else {
																	   updateFileForm(formId, blockId);
																	   
	 }
																			 });});
    
	
	var toogleField = new Fx.Reveal($(blockId), {duration: 1000, mode: 'vertical', transition: Fx.Transitions.Pow.easeOut});
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

var updateInbForm = function (formId, div) {
	var myForm = $(formId);
	var mySection = $(div);
	myLink = myForm.get('action');
	//alert(myForm+' :: '+mySection);
	//throw'';
    new Request({
		method: myForm.get('method'),
		url: 'actions/'+myLink,
        data: myForm,
        onComplete: function(response){
			
		var myFirst = response;
		//alert(response); throw '';
			hideSection(div);
			//highlight -> add class or keyframe animation - grey block
			var myParentSection = div.replace('update_','');
			if(myParentSection == 'md_transcript') { 
					var newUpdateElement = new Element('div', {
											 'class': 'div_update',
											 'html': myFirst
											 });
					//alert('oh noooh '+myFirst+' ++ '+myParentSection);
			//$('md_transcript').appendHTML(myFirst);
					newUpdateElement.inject($(myParentSection), 'bottom');
			sectionHighlight(newUpdateElement);
					} else {
			$(myParentSection).set('html', myFirst);
			sectionHighlight(myParentSection);
			}
			//alert(myP);
			//activate + button (showaction) inside myParentSection
	var itemArray = $$('div#'+myParentSection+' a.action_link');
	itemArray.each(function(el) {el.addEvent('click', showAction);});
			}
    }).send();  
	  
  }

var updateFileForm = function (formId, div) {
	//new Form.Upload('file_title');
	var myForm = $(formId);
	var mySection = $(div);
	myLink = myForm.get('action');
	//throw'';
    new File.Upload({
		method: myForm.get('method'),
		url: 'actions/'+myLink,
			data: {
				student_ref: $('student_ref').get("value"),
				file_ref: $('file_ref').get("value"),
				MM_insert: $('MM_insert').get("value")
			},
		images: ['file_title'],
        onComplete: function(response){
			
		var myFirst = response;
		//alert(response); throw '';
			hideSection(div);
			//highlight -> add class or keyframe animation - grey block
			var myParentSection = div.replace('update_','');
			if(myParentSection == 'md_transcript') { 
					var newUpdateElement = new Element('div', {
											 'class': 'div_update',
											 'html': myFirst
											 });
			//$('md_transcript').appendHTML(myFirst);
					newUpdateElement.inject($(myParentSection), 'bottom');
			sectionHighlight(newUpdateElement);
					} else {
			$(myParentSection).set('html', myFirst);
			sectionHighlight(myParentSection);
			}
			//alert(myP);
			//activate + button (showaction) inside myParentSection
	var itemArray = $$('div#'+myParentSection+' a.action_link');
	itemArray.each(function(el) {el.addEvent('click', showAction);});
			}
    }).send();  
	  
  }

  
// ===================================================================
// VALIDATOR 
// based on mootools 1.4.5
// r.bach
// ===================================================================
function validate_email(e){
var txtFilter =  /^[a-zA-Z0-9\.+=_–-]+@[a-zA-Z0-9_–-]+(\.[a-zA-Z0-9_–-]{2,12})+$/;
// var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
var thisField = $(e).get('value');
if (!(thisField.match(txtFilter)))
	  {
		  if(!$('email_warning')){showWarning(e, 'Please provide a valid email');}
	  $(e).setStyles({background:'#FF3', color: '#000'});
	   return false}
	else{
		 $(e).setStyle('background-color', '#FFF');
		 if($('email_warning')){$('email_warning').destroy();};
		return true;}
}

function showWarning(e, warning) {
	var button	 = '<div class="warning"><h6>'+warning+'</h6></div><br/>';
	var newElement = new Element('div', {
    'class': 'warning_block',
    'html': button,
    'styles': {
        'display': 'block'
    },
    'id': $(e).id+'_warning'
	}
) ;

	newElement.inject($(e), 'after');
}


function validateMe() {
			var inputFields = Array.clone(requestItems);
			var emptyFields = new Array();
			var specialFields = new Array('ch_criminal', 'chk_declaration', 'english_qualification');
			var blankRE=/^\s*$/; //regular expression  rule to catch blank input fields incl with empty spaces
/*if($$('input[name=lifestyle]:checked')) {
			var myValue = $$('input[name=lifestyle]:checked').map(function(e){return e.value;});
			if(myValue) {
	alert('lifestyle ID: '+myValue);
				inputFields.erase('lifestyle');
				}
		}*/
			for (i=0;i<inputFields.length;i++)
	{
	var formElement = inputFields[i];
			//if($$('input[name='+formElement+']')) {class_num
			if(specialFields.contains(formElement)) { 
	$$('input[name='+formElement+']').map(function(e) {
			var parentClass = e.getParent('div');
			$(parentClass).setStyles({background:'#D5E6F8', color: '#000'});
			});

	var inputValue = $$('input[name='+formElement+']:checked').map(function(e) {return e.value;});
		} else {
	var inputValue = $(formElement).get('value');
	$(formElement).setStyles({background:'#FFF', color: '#000'});
	}
	
	//alert(formElement+': '+inputValue);
		if(formElement=='email' || formElement=='ref_email') {
			if(!validate_email(formElement)) emptyFields.push(formElement);
		}
		
	if(blankRE.test(inputValue)){
			emptyFields.push(formElement);
		}
			
	
}
	if (emptyFields.length >0) {
	emptyFields.each(function(item, index){
			if(specialFields.contains(item)) { 
							  //if(item=='lifestyle' || item=='english_course'|| item=='class_num') {
								   $$('input[name='+item+']').map(function(e) {
																		   var parentClass = e.getParent('div');
																		   $(parentClass).setStyles({background:'#FF3', color: '#000'});});
							  } else {
	$(item).setStyles({background:'#FF3', color: '#000'});
							  }
							  
	//alert(item);
});
	newDiv_btm("Please fill out highlighted fields above. Thank you");
	return false;
	}
}
// Show Warning using mootools library
var newDiv = function(e) {
			var newElementVar = '<h6>'+e+'</h6>';
			$('warning_top').set('html', newElementVar);
			$('warning_top').set('styles', {   visibility: 'visible'});
			var myFx_top = new Fx.Tween($('warning_top'), { 
    link: 'chain',
    property: 'opacity'
});
			myFx_top.set(0).start(1).wait(5000).start(0);
};
// Show Warning using mootools library
var newDiv_btm = function(e) {
			var newElementVar = '<h6>'+e+'</h6>';
			$('warning_btm').set('html', newElementVar);
			$('warning_btm').set('styles', {   visibility: 'visible'});
			var myFx_btm = new Fx.Tween($('warning_btm'), { 
    link: 'chain',
    property: 'opacity'
});
			myFx_btm.set(0).start(1).wait(5000).start(0);
};


function duplicateInputs() {
	var  valueField = ['adr_1', 'adr_2','city', 'pc','county', 'adr_country']
	var  duplicateField = ['contact_adr_1', 'contact_adr_2','contact_city', 'contact_pc','contact_county', 'contact_adr_country'];
	var  fieldTypes = ['input', 'input','input', 'input','input', 'select']
	valueField.each(function(el, index) {
		var newField = duplicateField[index];
		var fieldtype = fieldTypes[index];
			if(fieldtype == 'select') {
				var selectedCountry = $(el).getSelected().each(function(sel) {
				var newValue = sel.get('value');
				$(newField).set('value', newValue);
				});} else {
				var newValue = $(el).get('value');
				$(newField).set('value', newValue);
				}
				});
	}
// ===================================================================
// Checkboxes Check
// based on mootools 1.2
// r.bach
// ===================================================================
// Warnig msg
var warningArray = new Array()
warningArray[1] = 'Please tick all the boxes before you can continue.';
warningArray[2] = 'Please tick a box before you can continue.'; 

var checkCheck = function (wrn) {
	if(wrn === undefined) wrn = 1;
	var wrnMsg = warningArray[wrn];
	  var myMistake = new Array();
	  $$('.validate').each(function(el) {
									 if(!el.checked) {myMistake.push(el);}
									 });
	  if (myMistake.length >0) {
		  myMistake.each(function(item, index){
								  var newDiv = item.getParent('div');
								  newDiv.addClass("warnMe");
								  });
		  newDiv_btm(""+wrnMsg+"");
		  return false;
		  }
}

var warningCheck = function (wrn) {
	if(wrn === undefined) wrn = 1;
	var wrnMsg = warningArray[wrn];
	  var myMistake = new Array();
	  $$('.validate').each(function(el) {
									 if(!el.checked) {myMistake.push(el);}
									 });
	  if (myMistake.length >0) {
		  myMistake.each(function(item, index){
								  var newDiv = item.getParent('div');
								  newDiv.addClass("warnMe");
								  });
		  newDiv_btm(""+wrnMsg+"");
		  return false;
		  }
}
 
var validateCheck = function () {
	//check if UCAS is filled out only do calidate once it is filled out.
	 var inputFields = $$('.validate');//$A(requestItem2);
	 var myMistake = new Array();
	 $$('.validate').each(function(el) {
									if(!el.checked) {myMistake.push(el);}
		 var newDiv = el.getParent('div');
		 if(el.checked) {
			 if($(newDiv).hasClass('warnMe')) {newDiv.removeClass("warnMe");
			 }
			 if(!$(newDiv).hasClass('selectMe')) {newDiv.addClass("selectMe");}
			 } else {
				 if($(newDiv).hasClass('selectMe')) {newDiv.removeClass("selectMe");}
				 }
				 })
		  var inputeValue = $('checkValidate').get('value');
	   if (!myMistake.length) {
		  if(inputeValue == "false") { 
		  // activate button
		  activateBtn($('continue'), 3);
		  } 
	   } else {
		  if(inputeValue == "true") { 
		  // deactivate button
		  deactivateBtn($('continue'), 2);
		  }
	   }
	   
}

var checkEligibility = function (wrn) {
	if(wrn === undefined) wrn = 2;
	var wrnMsg = warningArray[wrn];
	  var myMistake = new Array();
	  $$('.validate').each(function(el) {
									 if(!el.checked) {myMistake.push(el);}
									 });
	  if (myMistake.length == 4) {
		  myMistake.each(function(item, index){
								  var newDiv = item.getParent('div');
								  newDiv.addClass("warnMe");
								  });
		  newDiv_btm(""+wrnMsg+"");
		  return false;
		  }
}

//Tcik box Msg
var boxArray = new Array()
boxArray[1] = 'Please Tick All Boxes';
boxArray[2] = 'Please Confirm';
boxArray[3] = 'Continue';

var deactivateBtn = function (btn, msg) {
	if(msg === undefined) msg = 1;
	var wrnMsg = boxArray[msg];
$('checkValidate').set('value', "false");
	if($(btn).hasClass('activeBtn')) {
		$(btn).removeClass("activeBtn");
		$(btn).addClass("inactiveBtn");
		$(btn).set('text', ""+wrnMsg+"");
	}
}
var activateBtn = function (btn, msg) {
	if(msg === undefined) msg = 1;
	var wrnMsg = boxArray[msg];
$('checkValidate').set('value', "true");
	if($(btn).hasClass('inactiveBtn')) {
		$(btn).removeClass("inactiveBtn");
		$(btn).addClass("activeBtn");
		$(btn).set('text', ""+wrnMsg+"");
	}
}
