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
        }
    };

    var view = {
        init: function(records) {
            this.numberOfColumns = records[Object.keys(records)[0]].length;

            this._createHeaderRow();
            this._createAllStudentRowsHTML(records);

            //TODO: create event handlers for each checkbox
            //TODO: notify octopus when a checkbox is clicked
        },

        render: function(name, attendance) {
            //TODO: render state of attendance
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
            html.push('<tr class="student">');
            html.push('<td class="name-col">' + name + '</td>');
            for(var column = 0; column < this.numberOfColumns; column++) {
                var checkedText = ' checked';
                if(!record[column]) {
                    absences++;
                    checkedText = '';
                }
                html.push('<td class="attend-col"><input type="checkbox"'+ checkedText +'></td>');

            }
            html.push('<td class="missed-col">'+ absences +'</td>');
            html.push('</tr>');
            return html.join();
        }
    };

    octopus.init();
});

///////////////////// ORIGINAL

/* STUDENT APPLICATION */
$(function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
