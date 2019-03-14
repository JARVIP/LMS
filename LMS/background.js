﻿//window.alert("aq var");
function addScript( src ) {
  var s = document.createElement( 'script' );
   // s.setAttribute('src', src);
    s.setAttribute('type', "text/javascript");
    s.textContent = src;
  document.body.appendChild(s);
}

function addStyle( src ) {
  var s = document.createElement( 'style' );
   // s.setAttribute('src', src);
    s.textContent = src;
  document.body.appendChild(s);
}



var myEle = document.getElementById("schedule");
  if(!!myEle){
      var shceduleScript = "$(document).ready(function(){ o = '/MyCourses/GetStudentCoursesSchedule'; e = ''; t = true; a = 'POST'; n='getSchedule'; i = ''; l = 'true'; r = { name: 'myShedule' }; s = true; start_time = new Date().getTime(); 1 == t, a = 'undefined' != typeof a && 'GET' == a.toUpperCase() ? 'GET' : 'POST', jQuery.ajax({ type: a, url: o, contentType: 'application/json', data: JSON.stringify(e), dataType: 'json', statusCode: { 404: function() { window.location.reload() }, 403: function() { window.location.reload() } } }).done(function(e) { var jsonData = e; drawTable(jsonData); }).fail(function() { }); function drawTable(jsonData) { var weekDayes = ['ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი',]; var object = jsonData; object = object.data; console.log(jsonData); var objects = []; $(object).each(function(){ var current = $(this)[0]; var obj = { CourseName: current.CourseName, SyllabusID: current.SyllabusID }; var valid = false; $(current.GroupDscr).each(function(){ var groupDscr = $(this).eq(0)[0]; $(groupDscr.StudyActivityDscr).each(function(){ var obj_clone = jQuery.extend(true, {}, obj); obj_clone.StudyActivityName = groupDscr.StudyActivityName; var stdActivity = $(this)[0]; obj_clone.Day=stdActivity.Day; obj_clone.Hour=stdActivity.Hour; obj_clone.EndHour=stdActivity.EndHour; obj_clone.Room= stdActivity.Room; obj_clone.Lector= stdActivity.Lector; objects.push(obj_clone); }); }); }); var body = $('<tbody/>'); var table = makeTable(); var tr = $('<tr/>'); for(j=0; j < $(weekDayes).length; j++){ $day = $(weekDayes)[j]; var td = $('<td/>'); var currentObjct = []; var appear = false; $(objects).each(function(){ var current = $(this)[0]; if(current.Day == $day) { currentObjct.push(current); appear = true; } }); if(appear) { currentObjct.sort(SortByName); var EndHour = ''; for(i = 0; i < currentObjct.length; i++) { var sameTime = false; for(k = i + 1; k < currentObjct.length; k++) { if(currentObjct[i].EndHour > currentObjct[k].Hour ) { sameTime = true; } } for(k = i-1; k >= 0; k--) { if(currentObjct[i].Hour < currentObjct[k].EndHour ) { sameTime = true; } } if(EndHour != '' && EndHour < currentObjct[i].Hour) { var breakTime = Math.abs(new Date('2015-03-25T'+ EndHour) - new Date('2015-03-25T'+ currentObjct[i].Hour)); breakTime = breakTime / (1000 * 3600); var breakTemplate = makeTimeBreakTemplate(EndHour, currentObjct[i].Hour,breakTime); td.append(breakTemplate); } EndHour = currentObjct[i].EndHour; var template = makeTemplate(currentObjct[i].StudyActivityName,currentObjct[i].Hour + '-' + currentObjct[i].EndHour,currentObjct[i].CourseName,currentObjct[i].Room,currentObjct[i].Lector,sameTime,currentObjct[i].SyllabusID); td.append(template); } tr.append(td); body.append(tr); }else { var cl = weekName($day); table.find(cl).remove(); } }; table.append(body); $('.main_contnt').html(table); } }); function SortByName(a, b){ var aName = a.Hour; var bName = b.Hour; return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0)); } function makeTable() { var table = $('<table/>').addClass('table table-bordered'); var thea = $('<thead/>'); var tr = $('<tr/>').addClass('active'); var mon = $('<td/>').addClass('mon').attr('width','16.6%').text('ორშაბათი'); var tue = $('<td/>').addClass('tue').attr('width','16.6%').text('სამშაბათი'); var wed = $('<td/>').addClass('wed').attr('width','16.6%').text('ოთხშაბათი'); var thu = $('<td/>').addClass('thu').attr('width','16.6%').text('ხუთშაბათი'); var fri = $('<td/>').addClass('fri').attr('width','16.6%').text('პარასკევი'); var sat = $('<td/>').addClass('sat').attr('width','16.6%').text('შაბათი'); tr.append(mon); tr.append(tue); tr.append(wed); tr.append(thu); tr.append(fri); tr.append(sat); thea.append(tr); table.append(thea); return table; } function weekName(p1) { var cl = ''; switch(p1) { case 'ორშაბათი': cl = '.mon'; break; case 'სამშაბათი': cl = '.tue'; break; case 'ოთხშაბათი': cl = '.wed'; break; case 'ხუთშაბათი': cl = '.thu'; break; case 'პარასკევი': cl = '.fri'; break; case 'შაბათი': cl = '.sat'; break; default: } return cl; } function makeTimeBreakTemplate(p1,p2,p3) { var div = $('<div/>').addClass('break-time'); var nameSP1 = $('<span/>').text(p1+ ' - ' + p2); var nameSP = $('<span/>').text('შესვენება ' + p3 + ' საათი'); var br = $('<br/>'); div.append(nameSP); div.append(br); div.append(nameSP1); return div; } function makeTemplate(p1,p2,p3,p4,p5,p6,p7) { var cl = ''; switch(p1) { case 'ლექცია ': cl = 'lecture'; break; case 'პრაქტიკული': cl = 'practice'; break; case 'ლაბორატორიული': cl = 'laboratory'; break; case 'სამუშაო ჯგუფი': cl = 'work-group'; break; default: } if(p6) { cl = 'same-time'; } var div = $('<div/>').addClass(cl); var nameSP = $('<span/>').text(p1+ ' - '); var timeSP = $('<span/>').text(p2); var headLine = $('<h5/>').text(p3); var small = $('<small/>').text(p4); var br = $('<br/>'); var lector = $('<small/>').text(p5); var silabus = $('<img/>').attr('src','http://lms.tsu.ge/imgs/leaf.png').attr('style','width:16px;float:right;cursor:pointer').attr('onclick','OpenSyllabusPanel('+ p7 +')'); div.append(nameSP); div.append(timeSP); div.append(headLine); div.append(small); div.append(br); div.append(lector); div.append(silabus); return div; } function getObjects(obj, key, val) { var retv = []; if(jQuery.isPlainObject(obj)) { if(obj[key] === val) retv.push(obj); var objects = jQuery.grep(obj, function(elem) { return (jQuery.isArray(elem) || jQuery.isPlainObject(elem)); }); retv.concat(jQuery.map(objects, function(elem){ return getObjects(elem, key, val); })); } return retv; } function OpenSyllabusPanel(SyllabusID) { window.open(getPath('Home/Syllabus?id=' + SyllabusID)); }";
      var shceduleCss = ".lecture { padding: 5px; background-color: #c8e8df; border-bottom: 3px solid #a2c7bb; } .practice { padding: 5px; background-color: #d4eabb; border-bottom: 3px solid #becab1; } .work-group { padding: 5px; background-color: #fff4cc; border-bottom: 3px solid #d8cfae; } .laboratory { padding: 5px; background-color: #b5c7e8; border-bottom: 3px solid #86a2af; } .same-time { padding: 5px; background-color: #ff6666; border-bottom: 3px solid #ff3939; color:#fff; } .table-bordered>tbody>tr>td { padding: 0px; } .break-time { padding: 10px 5px; border-bottom: 3px solid #a0a22e; background-color: #fbff07; } .v-align { vertical-align:middle !important; }";
      addStyle(shceduleCss);
      addScript(shceduleScript);
  }
  else
  {
    var studentCardScript = "function getData() { var store; store = Ext.create('Ext.data.Store', { groupField: 'EduProgramNameAndType', fields: [{ name: 'SubjectTypeName', type: 'string' }, { name: 'StatusName', type: 'string' }, { name: 'EduCourseName', type: 'string' }, { name: 'SubjectStatusName', type: 'string' }, { name: 'SubjEduProgramTypeName', type: 'string' }, { name: 'StudySeasonName', type: 'string' }, { name: 'SemesterName', type: 'string' }, { name: 'SubjectName', type: 'string' }, { name: 'SubjectCode', type: 'string' }, { name: 'SubjectSelectionTypeName', type: 'string' }, { name: 'Credit', type: 'string' }, { name: 'Score', type: 'string' }, { name: 'SubjectNameEng', type: 'string' }, { name: 'EduProgramNameAndType', type: 'string' }, { name: 'EduCoursesGradesGroupingID', type: 'int' }, { name: 'IsActive', type: 'bool' }, { name: 'StatusID', type: 'int' }, { name: 'SyllabusID', type: 'int' }, { name: 'CourseProfessor', type: 'string' }, { name: 'componentGrades', type: 'string' }], autoLoad: true, proxy: { type: 'ajax', api: { read: getPath('StudentCard/GetStudentProfilesVW2') }, actionMethods: { read: 'POST' }, reader: { type: 'json', root: 'data', totalProperty: 'totalCount' } }, listeners: { beforeload: function (store) { store.proxy.extraParams = { start: 0, limit: 10000 }; } } }); store.on('load', function (store, records, successful, operation, options) { createTable(store.data.items); }); } function createTable(data) { $(\"#studentProfile\").html(\"\"); $(\"#studentProfile\").append(\"<div id='gpa'></div>\"); var table = $(\"<table/>\").addClass(\"table\").addClass(\"table-bordered\"); var thead = $(\"<thead/>\"); var theadTr = $(\"<tr/>\"); var tbody = $(\"<tbody/>\"); theadTr.append(\"<th></th>\"); theadTr.append(\"<th>დისციპლინა</th>\"); theadTr.append(\"<th>სემესტრი</th>\"); theadTr.append(\"<th>კრედიტი</th>\"); theadTr.append(\"<th>ქულა</th>\"); theadTr.append(\"<th>შეფასება</th>\"); theadTr.append(\"<th>სილაბუსი</th>\"); theadTr.append(\"<th>დეტალურად</th>\"); thead.append(theadTr); table.append(thead); table.append(tbody); $(data).each(function () { var tr = $(\"<tr/>\"); tr.append(\"<td>\" + getCheckMark($(this)[0].data.StatusID) + \"</td>\"); tr.append(\"<td>\" + $(this)[0].data.SubjectName + \"</td>\"); tr.append(\"<td>\" + $(this)[0].data.StudySeasonName + \" - \" + $(this)[0].data.SemesterName + \"</td>\"); tr.append(\"<td>\" + $(this)[0].data.Credit + \"</td>\"); tr.append(\"<td>\" + $(this)[0].data.Score + \"</td>\"); tr.append(\"<td>\" + getGPA($(this)[0].data.Score) + \"</td>\"); tr.append(\"<td>\" + renderSilabus($(this)[0].data.SyllabusID) + \"</td>\"); tr.append(\"<td>\" + renderDetailButton($(this)[0].data.IsActive, $(this)[0].data.EduCoursesGradesGroupingID, $(this)[0].data.EduCourseName) + \"</td>\"); tbody.append(tr); }); $(\"#studentProfile\").append(table); getAvGpa(); } function getCheckMark(p1) { if (p1 == 2 || p1 == 3) { return '<div style=\"text-align:center\"><img src=\"' + getPath('imgs/Checkmark.png') + '\"style=\"height:16px;width:16px\"/></div>'; } else return '<div data-qtip=\"კიდევ სცადეთ\" style=\"text-align:center\"><img src=\"' + getPath('imgs/Failed.png') + '\"style=\"height:16px;width:16px\"/></div>'; } function getGPA(p1) { if (p1 > 90.4) return 'A'; if (p1 > 80.4 && p1 <= 90.4) return 'B'; if (p1 > 70.4 && p1 <= 80.4) return 'C'; if (p1 > 60.4 && p1 <= 70.4) return 'D'; if (p1 > 50.4 && p1 <= 60.4) return 'E'; if (p1 > 40.4 && p1 <= 50.4) return 'FX'; return 'F'; } function renderSilabus(sylabusId) { return '<div data-qtip=\"სილაბუსი\" style=\"text-align:center\" onclick=\"OpenSyllabusPanel(' + sylabusId + ')\"><img src=\"' + getPath('imgs/leaf.png') + '\"style=\"height:16px;width:16px;cursor:pointer\"/></div>'; } function renderDetailButton(active, edCourseGras, EduCourseName) { if (active == true && edCourseGras != 0) { return '<div data-qtip=\"დეტალური ცხრილი\" style=\"text-align:center\" onclick=\"OpenGradesPanel(' + edCourseGras + ',\"' + EduCourseName + '\"' + ')\" ><img src=\"' + getPath('imgs/view_Details.png') + '\"style=\"height:16px;width:16px;cursor:pointer\"/></div>'; } else { return \"\"; } } function getAvGpa() { Ext.Ajax.request({ url: getPath('StudentCard/GetStudentInfoPortal'), method: 'POST', success: function (result) { var resultObj = Ext.decode(result.responseText); if (resultObj.success) { var data = resultObj.data; $(\"#gpa\").append(data.Info); } } }); } getData();";
    addScript(studentCardScript);
  }


