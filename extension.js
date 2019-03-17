

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
        { name: 'EduProgramNameAndType', type: 'string' }, { name: 'EduCoursesGradesGroupingID', type: 'int' },
        { name: 'IsActive', type: 'bool' }, { name: 'StatusID', type: 'int' }, { name: 'SyllabusID', type: 'int' },
        { name: 'CourseProfessor', type: 'string' },
        { name: 'componentGrades', type: 'string' }
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
    $('#studentProfile').html('');
    $('#studentProfile').append('<div id=\"gpa\"></div>');
    var table = $('<table/>').addClass('table').addClass('table-bordered');
    var thead = $('<thead/>');
    var theadTr = $('<tr/>');
    var tbody = $('<tbody/>');
    theadTr.append('<th></th>');
    theadTr.append('<th>დისციპლინა</th>');
    theadTr.append('<th>სემესტრი</th>');
    theadTr.append('<th>კრედიტი</th>');
    theadTr.append('<th>ქულა</th>');
    theadTr.append('<th>შეფასება</th>');
    theadTr.append('<th>სილაბუსი</th>');
    theadTr.append('<th>დეტალურად</th>');
    thead.append(theadTr);
    table.append(thead);
    table.append(tbody);
    
     $(data).each(function () {
         var tr = $('<tr/>');
         tr.append('<td>' + getCheckMark($(this)[0].data.StatusID) + '</td>');
         tr.append('<td>' + $(this)[0].data.SubjectName + '</td>');
         tr.append('<td>' + $(this)[0].data.StudySeasonName + ' - ' + $(this)[0].data.SemesterName + '</td>');
         tr.append('<td>' + $(this)[0].data.Credit + '</td>');
         tr.append('<td>' + $(this)[0].data.Score + '</td>');
         tr.append('<td>' + getGPA($(this)[0].data.Score) + '</td>');
         tr.append('<td>' + renderSilabus($(this)[0].data.SyllabusID) + '</td>');
         tr.append('<td>' + renderDetailButton($(this)[0].data.IsActive, $(this)[0].data.EduCoursesGradesGroupingID, $(this)[0].data.EduCourseName) + '</td>');
         tbody.append(tr);
    });
    
    $('#studentProfile').append(table);
    getAvGpa();
    makeGPACalculator(data);
}

function getCheckMark(p1) {
    if (p1 == 2 || p1 == 3) {
        return '<div style=\"text-align:center\"><img  src=\"' + getPath('imgs/Checkmark.png') + '\"style=\"height:16px;width:16px\"/></div>';
    }
    else return '<div data-qtip=\"კიდევ სცადეთ\" style=\"text-align:center\"><img  src=\"' + getPath('imgs/Failed.png') + '\"style=\"height:16px;width:16px\"/></div>';
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
    return '<div data-qtip=\"სილაბუსი\" style=\"text-align:center\" onclick=\"OpenSyllabusPanel(' + sylabusId + ')\"><img src=\"' + getPath('imgs/leaf.png') + '\"style=\"height:16px;width:16px;cursor:pointer\"/></div>';

}


function renderDetailButton(active, edCourseGras, EduCourseName) {
    if (active == true && edCourseGras != 0) {
        return '<div data-qtip=\"დეტალური ცხრილი\" style=\"text-align:center\" onclick=\"OpenGradesPanel(' + edCourseGras + ',\\'' + EduCourseName + '\\')\" ><img  src=\"' + getPath('imgs/view_Details.png') + '\"style=\"height:16px;width:16px;cursor:pointer\"/></div>';
    }
    else {
        return '';
    }
}

function getAvGpa() {
    Ext.Ajax.request({
        url: getPath('StudentCard/GetStudentInfoPortal'),
        method: 'POST',
        success: function (result) {
            var resultObj = Ext.decode(result.responseText);
            if (resultObj.success) {
                var data = resultObj.data;
                $('#gpa').append(data.Info);
            }
        }
    });
}
function addRow(data) {
if(!data) data = [{'data':{SubjectName: '', Score:'',Credit:''}}];
  $(data).each(function () {
      $('#grades_table tbody').append(
        $('<tr />').attr('class', 'grade_row')
        .append(
          $('<td />').append(
            $('<input />')
              .attr({
                'type': 'text',
                'class': 'class_field',
                'name': 'class',
                'placeholder':'შევსება არ არის სავალდებულო',
                'value':$(this)[0].data.SubjectName,
                'style':'min-width: 210px;'
              })
          )
        )
        .append(
          $('<td />').append(
            $('<select/>')
              .attr({
                'class': 'grade_field',
                'name': 'grade',
              })
              .append($('<option/>') .attr({
                'value': '4.0'
              }).text('A'))
              .append($('<option/>') .attr({
                'value': '3.0'
              }).text('B'))
              .append($('<option/>') .attr({
                'value': '2.0'
              }).text('C'))
              .append($('<option/>') .attr({
                'value': '1.0'
              }).text('D'))
              .append($('<option/>') .attr({
                'value': '0.5'
              }).text('E'))
              .append($('<option/>') .attr({
                'value': '0'
              }).text('F'))
              .val(getScore($(this)[0].data.Score))
              .attr('style','width: initial;')
          )
        )
        .append(
          $('<td />').append(
            $('<input />')
              .attr({
                'type': 'text',
                'class': 'credits_field',
                'name': 'credits',
                'size': '3',
                'value':$(this)[0].data.Credit,
              })
          )
        )  
        .append(
          $('<td />').append(
            $('<a />')
              .attr({
                'href': '#',
                'class': 'remove_field',
                'style':'color:red;line-height: 35px; font-size: 16px;'
              })
              .text('x')
          )
        )
      );
    });
  }
  
  
  function makeForm()
  {
    var form = $('<form/>').attr('id','gpa_form')
      .append( $('<table/>')
      .addClass('table table-bordered')
        .attr('id','grades_table')
        .attr('style','width: initial;margin-bottom: 10px;')
      .append($('<thead/>')
        .append($('<tr/>')
          .append($('<th/>').text('დისციპლინა'))
          .append($('<th/>').text('შეფასება'))
          .append($('<th/>').text('კრედიტი'))
          .append($('<th/>').text('X'))
          ))
      .append($('<tbody/>')))
      .append($('<div/>').attr('id','gpa_output').attr('style','margin: 10px 0px;font-size: 16px;'))
      .append($('<a/>').attr('href','javascript:void(0);').addClass('btn btn-default').attr('id','add_row').text('დისციპლინის დამატება').attr('style','margin-right: 10px; line-height: 24px; background-color: #abce74;'))
      .append($('<input/>').attr('type','submit').val('გამოთვლა').addClass('btn btn-success'));
 
    return form;
  }
  function getScore(p1) {
    if (p1 > 90.4) return '4.0';
    if (p1 > 80.4 && p1 <= 90.4) return '3.0';
    if (p1 > 70.4 && p1 <= 80.4) return '2.0';
    if (p1 > 60.4 && p1 <= 70.4) return '1.0';
    if (p1 > 50.4 && p1 <= 60.4) return '0.5';
    if (p1 > 40.4 && p1 <= 50.4) return '0';
    return '0';
}

  function makeGPACalculator(data) {
    $('#studentProfile').append($('<div/>').text('?')
        .attr('data-qtip','GPA კალკულატორი <br/><br/> მოცემული ფორმა დაგეხმარებათ მარტივად გამოთვალოთ GPA-ის რაოდენობა შეფასებასა და კრედიტების რაოდენობაზე დაყრდნობით <br/><br/> დაამატეთ სასურველი რაოდენობის დისციპლინა „დისციპლინის დამატება“ ღილაკის გამოყენებით, აირჩიეთ შეფასება და შეიტანეთ კრედიტების რაოდენობა (ყურადღება: გამოთვლაში მონაწილეობას არ მიიღებს დისციპლინა რომლის კრედიტის ველი იქნება ცარიელი. დისციპლინა ველის შევსება არ არის სავალდებულო) და დააჭირეთ ღილაკს „გამოთვლა“')
        .attr('style','cursor: pointer; width: 30px; height: 30px; margin: 10px 0px; text-align: center; line-height: 30px; border: 1px solid; font-size: 20px; border-radius: 50%;'));
    $('#studentProfile').append(makeForm());
  
    addRow(data);
  
    $('#add_row').click(function(){
      addRow();
    });

    $(document).on('click','.remove_field',function(e){
      e.preventDefault();
      $(this).closest('tr').remove();
    });

    $(document).on('change','.grade_field',function(){
      console.log($(this).val());
      if($(this).val() == 0)
      {
        $(this).closest('tr').find('.credits_field').val('').attr('readonly','readonly');
      }
      else
      {
        $(this).closest('tr').find('.credits_field').removeAttr('readonly');
      }
    });
    
    $('#gpa_form').submit(function(e) {
      e.preventDefault();
      
      var gradePoints = 0.0;
      var totalCredits = 0.0;
      
      $('.grade_row').each(function(i) {
        if ($(this).find('.grade_field').val() == '' || $(this).find('.credits_field').val() == '') {
          return;
        }        
        gradePoints += parseFloat($(this).find('.grade_field').val()) * parseFloat($(this).find('.credits_field').val());
        totalCredits += parseFloat($(this).find('.credits_field').val());
      });

        var gpa = gradePoints / totalCredits;
      
      if (gradePoints == 0.0 || totalCredits == 0.0) {
        $('#gpa_output').text('შეიტანეთ მინიმუმ ერთი საგნის კრედიტების რაოდენობა');
      } else if (isNaN(gpa)) {
        $('#gpa_output').text('დაფიქსირდა შეცდომა');
      } else {
        $('#gpa_output').html('<span style=\"font-weight: bold;\">GPA:</span>' + gpa);
      }
    });
  };

getData();

