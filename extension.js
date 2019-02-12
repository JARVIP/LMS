
function getData() {
    var store;
    store = Ext.create('Ext.data.Store', {
        groupField: 'EduProgramNameAndType',
        fields: [{ name: 'SubjectTypeName', type: 'string' }, { name: 'StatusName', type: 'string' }, { name: 'EduCourseName', type: 'string' },
        { name: 'SubjectStatusName', type: 'string' }, { name: 'SubjEduProgramTypeName', type: 'string' },
        { name: 'StudySeasonName', type: 'string' }, { name: 'SemesterName', type: 'string' },
        { name: 'SubjectName', type: 'string' }, { name: 'SubjectCode', type: 'string' },
        { name: 'SubjectSelectionTypeName', type: 'string' }, { name: 'Credit', type: 'string' },
        { name: 'Score', type: 'string' }, { name: 'SubjectNameEng', type: 'string' },
        //{ name: 'CourseProfessor', type: 'string'},
        { name: 'EduProgramNameAndType', type: 'string' }, { name: 'EduCoursesGradesGroupingID', type: 'int' },
        { name: 'IsActive', type: 'bool' }, { name: 'StatusID', type: 'int' }, { name: 'SyllabusID', type: 'int' },
        { name: 'CourseProfessor', type: 'string' },//Ako
        { name: 'componentGrades', type: 'string' }//Ako
        ],
        autoLoad: true,
        proxy: {
            type: 'ajax',
            api: { read: getPath('StudentCard/GetStudentProfilesVW2') },
            actionMethods: { read: 'POST' },
            reader: { type: 'json', root: 'data', totalProperty: 'totalCount' }
        },
        listeners: {
            beforeload: function (store) { store.proxy.extraParams = { start: 0, limit: 10000 }; }
        }
    });
    store.on('load', function (store, records, successful, operation, options) {
        createTable(store.data.items);
    });
}

function createTable(data) {
    $("#studentProfile").html("");
    var table = $("<table/>").addClass("table").addClass("table-bordered");
    var thead = $("<thead/>");
    var theadTr = $("<tr/>");
    var tbody = $("<tbody/>");
    theadTr.append("<th></th>");
    theadTr.append("<th>დისციპლინა</th>");
    theadTr.append("<th>სემესტრი</th>");
    theadTr.append("<th>კრედიტი</th>");
    theadTr.append("<th>ქულა</th>");
    theadTr.append("<th></th>");
    theadTr.append("<th>სილაბუსი</th>");
    theadTr.append("<th>დეტალურად</th>");
    thead.append(theadTr);
    table.append(thead);
    table.append(tbody);
    
     $(data).each(function () {
         console.log($(this)[0].data.EduCourseName);
         var tr = $("<tr/>");
         tr.append("<td>" + getCheckMark($(this)[0].data.StatusID) + "</td>");
         tr.append("<td>" + $(this)[0].data.SubjectName + "</td>");
         tr.append("<td>" + $(this)[0].data.SemesterName + "</td>");
         tr.append("<td>" + $(this)[0].data.Credit + "</td>");
         tr.append("<td>" + $(this)[0].data.Score + "</td>");
         tr.append("<td>" + getGPA($(this)[0].data.Score) + "</td>");
         tr.append("<td>" + renderSilabus($(this)[0].data.SyllabusID) + "</td>");
         tr.append("<td>" + renderDetailButton($(this)[0].data.IsActive, $(this)[0].data.EduCoursesGradesGroupingID, $(this)[0].data.EduCourseName) + "</td>");
         tbody.append(tr);
     });
    
    $("#studentProfile").append(table);
   
}

function getCheckMark(p1) {
    if (p1 == 2 || p1 == 3) {
        return '<div data-qtip="ჩაბარებული" style="text-align:center"><img  src="' + getPath('imgs/Checkmark.png') + '"style="height:16px;width:16px;cursor:pointer"/></div>';
    }
    else return '<div data-qtip="კიდევ სცადეთ" style="text-align:center"><img  src="' + getPath('imgs/Failed.png') + '"style="height:16px;width:16px;cursor:pointer"/></div>';
}

function getGPA(p1) {
    if (p1 > 90.4) return 'A';
    if (p1 > 80.4 && p1 <= 90.4) return 'B';
    if (p1 > 70.4 && p1 <= 80.4) return 'C';
    if (p1 > 60.4 && p1 <= 70.4) return 'D';
    if (p1 > 50.4 && p1 <= 60.4) return 'E';
    if (p1 > 40.4 && p1 <= 50.4) return 'FX';
    return 'F';
}

function  renderSilabus (sylabusId) {
    return '<div data-qtip="სილაბუსი" style="text-align:center" onclick="OpenSyllabusPanel(' + sylabusId + ')"><img src="' + getPath('imgs/leaf.png') + '"style="height:16px;width:16px"/></div>';

}


function renderDetailButton(active, edCourseGras, EduCourseName ) {
    if (active == true && edCourseGras != 0) {
        return '<div data-qtip="დეტალური ცხრილი" style="text-align:center" onclick="OpenGradesPanel(' + edCourseGras + ',\'' + EduCourseName + '\'' + ')" ><img  src="' + getPath('imgs/view_Details.png') + '"style="height:16px;width:16px;cursor:pointer"/></div>';
    }
}
