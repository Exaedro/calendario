const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysInMonth = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

let currentDate = new Date();
let selectedDate = null;

function loadEvents() {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : {};
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

function renderCalendar() {
    const monthYear = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const events = loadEvents();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    daysContainer.innerHTML = "";

    if (currentYear % 4 === 0 && (currentYear % 100 !== 0 || currentYear % 400 === 0)) {
        daysInMonth[1] = 29;
    } else {
        daysInMonth[1] = 28;
    }

    let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        daysContainer.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth[currentMonth]; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        day.textContent = i;

        const eventKey = `${currentYear}-${currentMonth + 1}-${i}`;
        if (events[eventKey]) {
            day.classList.add('has-event');
            day.title = events[eventKey];
        }

        day.addEventListener('click', () => {
            selectedDate = `${currentYear}-${currentMonth + 1}-${i}`;
            document.getElementById('event-name').value = events[selectedDate] || "";
            document.getElementById('event-modal').style.display = "flex";
        });

        daysContainer.appendChild(day);
    }

    renderEventsList();
}

function renderEventsList() {
    const events = loadEvents();
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = "";

    for (const date in events) {
        const li = document.createElement('li');
        li.textContent = `${date}: ${events[date]}`;

        const actions = document.createElement('div');
        actions.classList.add('event-actions');
        
        const editBtn = document.createElement('button');
        editBtn.textContent = "Editar";
        editBtn.addEventListener('click', () => editEvent(date));
        actions.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Eliminar";
        deleteBtn.addEventListener('click', () => deleteEvent(date));
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        eventsContainer.appendChild(li);
    }
}

function editEvent(date) {
    const events = loadEvents();
    selectedDate = date;
    document.getElementById('event-name').value = events[date] || "";
    document.getElementById('event-modal').style.display = "flex";
}

function deleteEvent(date) {
    const events = loadEvents();
    delete events[date];
    saveEvents(events);
    renderCalendar();
}

function navigateToDate(date) {
    const [year, month, day] = date.split('-');
    currentDate = new Date(year, month - 1, day)
    renderCalendar();
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('save-event').addEventListener('click', () => {
    const eventName = document.getElementById('event-name').value;
    if (selectedDate && eventName.trim()) {
        const events = loadEvents();
        events[selectedDate] = eventName;
        saveEvents(events);
        renderCalendar();
        document.getElementById('event-modal').style.display = "none";
    }
});

document.getElementById('cancel-event').addEventListener('click', () => {
    document.getElementById('event-modal').style.display = "none";
});

renderCalendar();
