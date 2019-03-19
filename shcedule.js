
    
$(document).ready(function(){
    o = '/MyCourses/GetStudentCoursesSchedule';
    e = '';
    t = true;
    a = 'POST';
    n='getSchedule';
    i = '';
    l = 'true';
    r = { name: 'myShedule' };
    s = true;
    start_time = new Date().getTime();
    1 == t, a = 'undefined' != typeof a && 'GET' == a.toUpperCase() ? 'GET' : 'POST', jQuery.ajax({
        type: a,
        url: o,
        contentType: 'application/json',
        data: JSON.stringify(e),
        dataType: 'json',
        statusCode: {
            404: function() {
                window.location.reload()
            },
            403: function() {
                window.location.reload()
            }
        }
    }).done(function(e) {
       var jsonData = e;
       drawTable(jsonData);

    }).fail(function() {
    });


    function drawTable(jsonData)
    {
    var weekDayes = ['ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი','კვირა'];
    var object = jsonData;
    object = object.data;
    console.log(jsonData);
    var objects = [];
    $(object).each(function(){
        var current = $(this)[0];
        var obj = {
            CourseName: current.CourseName,
            SyllabusID: current.SyllabusID
        };
        var valid = false;
        $(current.GroupDscr).each(function(){
            var groupDscr = $(this).eq(0)[0];
            $(groupDscr.StudyActivityDscr).each(function(){
                var obj_clone = jQuery.extend(true, {}, obj);
                obj_clone.StudyActivityName = groupDscr.StudyActivityName;
                var stdActivity = $(this)[0];
                obj_clone.Day=stdActivity.Day;
                obj_clone.Hour=stdActivity.Hour;
                obj_clone.EndHour=stdActivity.EndHour;
                obj_clone.Room= stdActivity.Room;
                obj_clone.Lector= stdActivity.Lector;
                objects.push(obj_clone);
            });
        });
    });
    var body = $('<tbody/>');
    var table = makeTable();

    var tr = $('<tr/>');
    for(j=0; j < $(weekDayes).length; j++){
        $day = $(weekDayes)[j];
        var td = $('<td/>');
        var currentObjct = [];
        var appear = false;
        $(objects).each(function(){
            var current = $(this)[0];
            if(current.Day == $day)
            {
                currentObjct.push(current);
                
                appear = true;
            }
        });
        if(appear)
        {
            currentObjct.sort(SortByName);
            var EndHour = '';
            for(i = 0; i < currentObjct.length; i++)
            {
                var sameTime = false;
                for(k = i + 1; k < currentObjct.length; k++)
                {
                    if(currentObjct[i].EndHour > currentObjct[k].Hour )
                    {
                        sameTime = true;
                    }
                }
                for(k = i-1; k >= 0; k--)
                {
                    if(currentObjct[i].Hour < currentObjct[k].EndHour )
                    {
                        sameTime = true;
                    }
                }
                if(EndHour != '' && EndHour < currentObjct[i].Hour)
                {
                    var breakTime = Math.abs(new Date('2015-03-25T'+ EndHour) - new Date('2015-03-25T'+ currentObjct[i].Hour));
                    breakTime = breakTime / (1000 * 3600);
                    var breakTemplate = makeTimeBreakTemplate(EndHour, currentObjct[i].Hour,breakTime);
                    td.append(breakTemplate);
                }
                EndHour = currentObjct[i].EndHour;
                var template = makeTemplate(currentObjct[i].StudyActivityName,currentObjct[i].Hour + '-' + currentObjct[i].EndHour,currentObjct[i].CourseName,currentObjct[i].Room,currentObjct[i].Lector,sameTime,currentObjct[i].SyllabusID);
                td.append(template);
            }
            tr.append(td);
            body.append(tr);
        }else
        {
            var cl = weekName($day);
            table.find(cl).remove();
        }
    
    };
    table.append(body);
    $('.main_contnt').html(table);
}
    
}); 

function SortByName(a, b){
    var aName = a.Hour;
    var bName = b.Hour; 
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}


function makeTable()
{
    var table = $('<table/>').addClass('table table-bordered');
    var thea = $('<thead/>');
    var tr = $('<tr/>').addClass('active');
    var mon = $('<td/>').addClass('mon').attr('width','14.28%').text('ორშაბათი');
    var tue = $('<td/>').addClass('tue').attr('width','14.28%').text('სამშაბათი');
    var wed = $('<td/>').addClass('wed').attr('width','14.28%').text('ოთხშაბათი');
    var thu = $('<td/>').addClass('thu').attr('width','14.28%').text('ხუთშაბათი');
    var fri = $('<td/>').addClass('fri').attr('width','14.28%').text('პარასკევი');
    var sat = $('<td/>').addClass('sat').attr('width','14.28%').text('შაბათი');
    var sun = $('<td/>').addClass('sun').attr('width','14.28%').text('კვირა');
    tr.append(mon);
    tr.append(tue);
    tr.append(wed);
    tr.append(thu);
    tr.append(fri);
    tr.append(sat);
    tr.append(sun);
    thea.append(tr);
    table.append(thea);
    return table;
}

function weekName(p1)
{
    var cl = '';
    switch(p1) {
        case 'ორშაბათი':
            cl = '.mon';
            break;
        case 'სამშაბათი':
            cl = '.tue';
            break;
        case 'ოთხშაბათი':
            cl = '.wed';
            break;
        case 'ხუთშაბათი':
            cl = '.thu';    
            break;
        case 'პარასკევი':
            cl = '.fri';    
            break;
        case 'შაბათი':
            cl = '.sat';    
            break;
        case 'კვირა':
            cl = '.sun';    
            break;
        default:
    }
    return cl;
}

function makeTimeBreakTemplate(p1,p2,p3)
{
    var div = $('<div/>').addClass('break-time');
    var nameSP1 = $('<span/>').text(p1+ ' - ' + p2);
    var nameSP = $('<span/>').text('შესვენება ' + p3 + ' საათი');
    var br = $('<br/>');
    
    div.append(nameSP);
    div.append(br);
    div.append(nameSP1);
    return div;
}

function makeTemplate(p1,p2,p3,p4,p5,p6,p7)
{
    var cl = '';
    switch(p1) {
        case 'ლექცია ':
            cl = 'lecture';
            break;
        case 'პრაქტიკული':
            cl = 'practice';
            break;
        case 'ლაბორატორიული':
            cl = 'laboratory';
            break;
        case 'სამუშაო ჯგუფი':
            cl = 'work-group';    
            break;
        default:
        }
        if(p6)
        {
            cl = 'same-time';
        }
        var div = $('<div/>').addClass(cl);
        var nameSP = $('<span/>').text(p1+ ' - ');
        var timeSP = $('<span/>').text(p2);
        var headLine = $('<h5/>').text(p3);
        var small = $('<small/>').text(p4);
        var br = $('<br/>');
        var lector = $('<small/>').text(p5);
        var silabus = $('<img/>').attr('src','http://lms.tsu.ge/imgs/leaf.png').attr('style','width:16px;float:right;cursor:pointer').attr('onclick','OpenSyllabusPanel('+ p7 +')');
        div.append(nameSP);
        div.append(timeSP);
        div.append(headLine);
        div.append(small);
        div.append(br);
        div.append(lector);
        div.append(silabus);
        return div;
}

function getObjects(obj, key, val) {
    var retv = [];

    if(jQuery.isPlainObject(obj))
    {
        if(obj[key] === val)
            retv.push(obj);

        var objects = jQuery.grep(obj, function(elem) {
            return (jQuery.isArray(elem) || jQuery.isPlainObject(elem));
        });

        retv.concat(jQuery.map(objects, function(elem){
            return getObjects(elem, key, val);
        }));
    }
    return retv;
    
}

function OpenSyllabusPanel(SyllabusID) {
    window.open(getPath('Home/Syllabus?id=' + SyllabusID));
}
