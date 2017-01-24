// returns the value of the college of the user's choice
function getCollege() {
    return $('#college option:selected').val();
}

// returns the value of the university of the user's choice
function getUniversity() {
    return $('#university option:selected').val();
}

// returns the value of the major of the user's choice
function getMajor() {
    return $('#major option:selected').val();
}

function checkValidCollege() {
    //getCollege();
    return $('#college option:selected').index() > 0;
}

function checkValidUniversity() {
    return $('#university option:selected').index() > 0;
}

function fillColleges() {
    $.getJSON('/from', function (data) {
        console.log(data);
        data.forEach(function (college) {
            $('#college').append('<option value="' + college + '">' + college + '</option>');
        });
    });
}

function fillUniversities() {
    $.getJSON('/to', function (data) {
        data.forEach(function (university) {
            $('#university').append('<option value="' + university + '">' + university + '</option>');
        });
    });
}

function fillDegrees() {
    if (getCollege() !== "Select a community college" &&
        getUniversity() !== "Select a 4-year university") {

        //     if ($('#major').is(':empty')) {
        document.getElementById('major').innerHTML = "";
        $('#course-table tbody').empty();
        $('#major').prop('disabled', false);
        $.get('/majors', {
            from: getCollege(),
            to: getUniversity()
        }, function (data) {
            data.forEach(function (major) {
                $('#major').append('<option value="' + major + '">' + major + '</option>');
            });
        });
        //   }
    } else {
        document.getElementById('major').innerHTML = "";
        $('#major').prop('disabled', true);
        $('#course-table tbody').empty();
    }
}

var getIds = function () {
    var ret;
    $.ajax({
        url: '/ids',
        async: false,
        dataType: "json",
        data: {
            college: getCollege()
        },
        success: function (data) {
            ret = data;
            console.log(data);
        }
    });
    return ret;
};



var addLinks = function (ids, text) {
    ids.forEach(function (id) {
        text = text.replace(id, '<a href="#' + getCollege() + '/' + id + '">' + id + '</a>');
    });
    return text;
};

var populateSections = function (college, course) {
    // get sections form the db and do stuff with them  
    console.log('pop sections');
    $.getJSON('/course', {
        college: college,
        id: course
    }, function (data) {
        console.log('course', data);
        var title = $('#course-heading').empty();
        title.text(data.name + ' (' + data.id + ') at ' + data.college);
        
        var content = $('#section-table tbody');
        content.empty();
        data.sessions.forEach(function (rowData) {
            var row = $('<tr>');
            row
                .append('<td>' + rowData.sessionNumber + '</td>' +
                    '<td>' + rowData.teacher + '</td>' +
                    '<td>' + rowData.capacity + '</td>' +
                    '<td>' + rowData.meetings +  '</td>');
            content.append(row);
        });
    });

};
/*
    $.getJSON('/ids', {
        college: college,
        course: course
    }, function (data) {
        var row = $('#section-table').empty();
        var content = $('#section-table tbody').empty();
        row.append('<th>Colleges</th> <th>Available Sections</th>');
        data.forEach(function (rowData) {
            row = $('#section-table');
            row
                .append('<tr><td>' + rowData[0] + '</td>' +
                    '<td>' + rowData[1] + '</td></tr>');
        });
    });
*/


var setHashMode  = function () {
    var newHash = location.hash,
        college = newHash.split('/')[0],
        course = newHash.split('/')[1];

    if (college && course) {
        $('#course-table').prop('hidden', true);
        $('#session-mode').prop('hidden', false);
        populateSections(college.replace('#', ''), course);
    } else {
        $('#course-table').prop('hidden', false);
        $('#session-mode').prop('hidden', true);
    }
};

window.onhashchange = setHashMode;

function displayTable() {
    if (getMajor() === "Select a major") {
        $('#course-table tbody').empty();
    } else {
        var ids = getIds();
        $.getJSON('/table', {
            from: getCollege(),
            to: getUniversity(),
            major: getMajor()
        }, function (data) {

            var content = $('#course-table tbody'),
                row;
            content.empty();
            data.forEach(function (rowData) {
                row = $('#course-table');
                row
                // ADD LINKS BELOW
                .append('<tr><td>' + addLinks(ids, rowData[1]) + '</td>' +
                    '<td>' + rowData[0] + '</td></tr>');

            });
        });
    }
}

$(document).ready(function () {
    fillColleges();
    fillUniversities();
    setHashMode();
});