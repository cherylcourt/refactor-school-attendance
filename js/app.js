/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

///////////////////// NEW

$(function(){
    var model = {
        init: function() {
            this.records = JSON.parse(localStorage.attendance);
        },

        getRecords: function() {
            return this.records;
        },

        getRecord: function(name) {
            return this.records[name];
        },

        updateRecord: function(name, column, attendance) {
            this.records[name][column] = attendance;
        }
    };

    var octopus = {
        init: function() {
            model.init();
            view.init(model.getRecords());
        },

        dayClicked: function(name, day, value) {
            model.updateRecord(name, day, value);
            view.render(name, model.getRecord(name));
        }
    };

    var view = {
        init: function(records) {
            this.numberOfColumns = records[Object.keys(records)[0]].length;

            this._createHeaderRow();
            this._createAllStudentRowsHTML(records);
        },

        render: function(name, record) {
            //TODO: render state of attendance
            var absences = 0;
            for(var column = 0; column < this.numberOfColumns; column++) {
                if(!record[column]) {
                    absences++;
                }
            }
            $("#"+ name +".missed-col").val(absences);
        },

        _createHeaderRow: function() {
            var headerRowHTML = [],
                column;

            headerRowHTML.push('<th class="name-col">Student Name</th>');
            for(column = 1; column <= this.numberOfColumns; column++) {
                headerRowHTML.push('<th>'+ column +'</th>');
            }
            headerRowHTML.push('<th class="missed-col">Days Missed</th>')
            $("#header-row").append(headerRowHTML.join());
        },

        _createAllStudentRowsHTML: function(records) {
            var html = [];
            for(var key in records) {
                html.push(this._createStudentRowHTML(key, records[key]));
            }
            $("#table-body").append(html.join());
        },

        _createStudentRowHTML: function(name, record) {
            var html = [],
                absences = 0;
            html.push('<tr id="'+ replaceSpacesWithDashes(name) +'" class="student">');
            html.push('<td class="name-col">' + name + '</td>');
            for(var column = 0; column < this.numberOfColumns; column++) {
                var checkedText = ' checked';
                if(!record[column]) {
                    absences++;
                    checkedText = '';
                }
                html.push('<td class="attend-col"><input id="'+ replaceSpacesWithDashes(name) + column.toString() + '" type="checkbox"'+ checkedText +'></td>');
                this._createClickHandler(name, column);
            }
            html.push('<td id="'+ name +'" class="missed-col">'+ absences +'</td>');
            html.push('</tr>');
            return html.join();
        }
        ,

        _createClickHandler: function(name, day) {
            var selector = "#"+ replaceSpacesWithDashes(name)+day.toString();
            console.log(selector);
            $(selector).on("click", {name: name, day: day}, function(event) {
                console.log("checkbox clicked: "+event.data.name+", "+event.data.day);
                octopus.dayClicked(event.data.name, event.data.day, $(this).prop('checked'));
            });
        }
    };

    octopus.init();
    //$("#Slappy-the-Frog0").on("click", {name: "Slappy the Frog", day: 0}, function(event) {
    //    console.log("WTF"+event.data.name+" ,"+$(this).prop('checked').toString());
    //    octopus.dayClicked(event.data.name, event.data.day, $(this).prop('checked'));
    //});
});

var replaceSpacesWithDashes = function(text) {
    return text.replace(new RegExp(" ", 'g'), "-");
};
///////////////////// ORIGINAL

/* STUDENT APPLICATION */
//$(function() {
//    var attendance = JSON.parse(localStorage.attendance),
//        $allMissed = $('tbody .missed-col'),
//        $allCheckboxes = $('tbody input');
//
//    // Count a student's missed days
//    function countMissing() {
//        $allMissed.each(function() {
//            var studentRow = $(this).parent('tr'),
//                dayChecks = $(studentRow).children('td').children('input'),
//                numMissed = 0;
//
//            dayChecks.each(function() {
//                if (!$(this).prop('checked')) {
//                    numMissed++;
//                }
//            });
//
//            $(this).text(numMissed);
//        });
//    }
//
//    // Check boxes, based on attendance records
//    $.each(attendance, function(name, days) {
//        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
//            dayChecks = $(studentRow).children('.attend-col').children('input');
//
//        dayChecks.each(function(i) {
//            $(this).prop('checked', days[i]);
//        });
//    });
//
//    // When a checkbox is clicked, update localStorage
//    $allCheckboxes.on('click', function() {
//        var studentRows = $('tbody .student'),
//            newAttendance = {};
//
//        studentRows.each(function() {
//            var name = $(this).children('.name-col').text(),
//                $allCheckboxes = $(this).children('td').children('input');
//
//            newAttendance[name] = [];
//
//            $allCheckboxes.each(function() {
//                newAttendance[name].push($(this).prop('checked'));
//            });
//        });
//
//        countMissing();
//        localStorage.attendance = JSON.stringify(newAttendance);
//    });
//
//    countMissing();
//}());
