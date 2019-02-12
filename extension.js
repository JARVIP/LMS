
var data;
function getData(callback) {
    var store = Ext.create('Ext.data.Store', {
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
        listeners: { beforeload: function (store) { store.proxy.extraParams = { start: 0, limit: 10000 } } }
    });
    data = store.data.items;

    callback();
}

$(document).ready(function () {
    getData(function () {

        $(data).each(function () {
            console.log($(this)[0].data.EduCourseName);

        });


    });
});
