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
            this.numberOfRecords = records.length;
            this.numberOfColumns = records[Object.keys(records)[0]].length;

            this._createHeaderRow();

        },

        render: function(records) {
            //TODO: render state of attendance
        },

        _createHeaderRow: function() {
            var headerRowHTML = [],
                row, column;

            headerRowHTML.push('<th class="name-col">Student Name</th>');
            for(var i = 1; i <= this.numberOfColumns; i++) {
                headerRowHTML.push('<th>'+i+'</th>')
            }
            headerRowHTML.push('<th class="missed-col">Days Missed</th>')
            $("#header-row").append(headerRowHTML.concat(''));
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
