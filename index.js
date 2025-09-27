const taskform = document.getElementById("taskform");
const tasklist = document.getElementById("tasklist");
const taskname = document.getElementById("taskname");
const subject = document.getElementById("subject");
const date = document.getElementById("date");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const completeno = document.getElementById("completeno");
const totalno = document.getElementById("totalno");
const chart = document.getElementById("chart");

// Loading tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let chartobj = null;

// Calendar
$(document).ready(function () {
    setTimeout(() => {
        $('#calendar').fullCalendar({
            events: generateCalendarEvents(),
            editable: false,
            droppable: false,
        });
    }, 100);
});

// Generating calendar events
function generateCalendarEvents() {
    return tasks.map(task => ({
        title: `${task.name} - ${task.subject}`,
        start: task.date,
        color: task.completed ? 'green' : 'red',
    }));
}

// Add Task
taskform.addEventListener("submit", function (e) {
    e.preventDefault();

    const newtask = {
        id: Date.now(),
        name: taskname.value.trim(),
        subject: subject.value.trim(),
        date: date.value,
        priority: parseInt(priority.value),
        category: category.value,
        completed: false
    };

    tasks.push(newtask);
    save();
    reset();
    update();
});


// Delete Task
function deletetask(id) {
    tasks = tasks.filter(t => t.id != id);
    save();
    update();
}

// Task Complete
function taskcomplete(id) {
    const task = tasks.find(t => t.id == id);
    if(task) {
        task.completed = !task.completed;
        save();
        update();
    }
}


// Save in LocalStorage
function save(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Reset Form
function reset() {
    taskform.reset();
}

// Update Display
function update() {
    tasklist.innerHTML = "";
    let completetask = 0;

    tasks.forEach(task => {
        var li = document.createElement("li");
        //li.classList.add(task.completed == true ? "completed" : "");
        if(task.completed) {
            li.classList.add("completed");
        }
        li.innerHTML = `
            <span> ${task.name} - ${task.subject} - Category: ${task.category} - Deadline: ${task.date} - Priority: ${task.priority} </span>
            <div style="display:flex; gap:10px; margin-top:5px;">
                <button class="complete" onclick="taskcomplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete" onclick="deletetask(${task.id})">Delete</button>
            </div>
        `;
        tasklist.appendChild(li);
        if(task.completed){
            completetask++;
        }
    });

    completeno.textContent = completetask;
    totalno.textContent = tasks.length;

    // Update Calendar
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', generateCalendarEvents());

    // Update Chart
    updatechart();
}

// Update Chart
function updatechart() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    const ch = chart.getContext('2d');

    if(chartobj) {
        chartobj.destroy();
    }

    chartobj = new Chart(ch, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                label: 'Task Completion',
                data: [completed, total-completed],
                backgroundColor: ['#2ecc71', '#e74c3c'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Notification Permission
if("Notification" in window && Notification.permission != "granted") {
    Notification.requestPermission();
}

update();