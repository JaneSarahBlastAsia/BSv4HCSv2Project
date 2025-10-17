document.addEventListener('DOMContentLoaded', function() {
    // Initialize date variables
    const today = new Date();
    let currentViewDate = new Date(today);
    let currentView = 'month'; // Default view
    
    // Initialize the calendar
    renderCalendar();
    loadUpcomingAppointments();
    loadBlockedTimePeriods();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render the calendar based on current view and date
    function renderCalendar() {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;
        
        // Update the date range display
        updateDateRangeDisplay();
        
        // Clear the container
        calendarContainer.innerHTML = '';
        
        // Render the appropriate view
        switch(currentView) {
            case 'month':
                renderMonthView(calendarContainer);
                break;
            case 'week':
                renderWeekView(calendarContainer);
                break;
            case 'day':
                renderDayView(calendarContainer);
                break;
        }
    }
    
    // Update the date range display based on current view
    function updateDateRangeDisplay() {
        const dateRangeElement = document.querySelector('.current-date-range');
        if (!dateRangeElement) return;
        
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        switch(currentView) {
            case 'month':
                dateRangeElement.textContent = `${months[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()}`;
                break;
            case 'week':
                // Get the start and end of the week
                const weekStart = new Date(currentViewDate);
                weekStart.setDate(currentViewDate.getDate() - currentViewDate.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                // Format the date range
                const startMonth = months[weekStart.getMonth()].substring(0, 3);
                const endMonth = months[weekEnd.getMonth()].substring(0, 3);
                
                if (weekStart.getMonth() === weekEnd.getMonth()) {
                    dateRangeElement.textContent = `${startMonth} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                } else {
                    dateRangeElement.textContent = `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                }
                break;
            case 'day':
                const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentViewDate.getDay()];
                dateRangeElement.textContent = `${dayOfWeek}, ${months[currentViewDate.getMonth()]} ${currentViewDate.getDate()}, ${currentViewDate.getFullYear()}`;
                break;
        }
    }
    
    // Render the month view calendar
    function renderMonthView(container) {
        // Create a grid for the month view
        const monthGrid = document.createElement('div');
        monthGrid.className = 'month-view';
        
        // Add day headers (Sun, Mon, etc.)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headerRow = document.createElement('div');
        headerRow.className = 'row mb-2';
        
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'col text-center font-weight-bold';
            dayHeader.textContent = day;
            headerRow.appendChild(dayHeader);
        });
        
        monthGrid.appendChild(headerRow);
        
        // Get the first day of the month
        const firstDay = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), 1);
        const startingDay = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
        
        // Get the last day of the month
        const lastDay = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 0);
        const totalDays = lastDay.getDate();
        
        // Get the last day of the previous month
        const prevMonthLastDay = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), 0).getDate();
        
        // Calculate the number of rows needed
        const rows = Math.ceil((startingDay + totalDays) / 7);
        
        let date = 1;
        let nextMonthDate = 1;
        
        // Create the calendar grid
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'row mb-2';
            
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('div');
                cell.className = 'col p-0';
                
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day';
                
                if (i === 0 && j < startingDay) {
                    // Previous month days
                    const prevMonthDay = prevMonthLastDay - startingDay + j + 1;
                    dayDiv.className += ' other-month';
                    dayDiv.innerHTML = `<div class="calendar-day-number">${prevMonthDay}</div>`;
                } else if (date > totalDays) {
                    // Next month days
                    dayDiv.className += ' other-month';
                    dayDiv.innerHTML = `<div class="calendar-day-number">${nextMonthDate}</div>`;
                    nextMonthDate++;
                } else {
                    // Current month days
                    const currentDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), date);
                    
                    if (currentDate.toDateString() === today.toDateString()) {
                        dayDiv.className += ' today';
                    }
                    
                    dayDiv.innerHTML = `<div class="calendar-day-number">${date}</div>`;
                    
                    // Add events for this day
                    const events = getEventsForDate(currentDate);
                    events.forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = `calendar-event ${event.type === 'appointment' ? 'event-appointment' : 'event-blocked'}`;
                        eventDiv.textContent = event.title;
                        eventDiv.dataset.eventId = event.id;
                        eventDiv.addEventListener('click', () => showEventDetails(event));
                        dayDiv.appendChild(eventDiv);
                    });
                    
                    date++;
                }
                
                cell.appendChild(dayDiv);
                row.appendChild(cell);
            }
            
            monthGrid.appendChild(row);
        }
        
        container.appendChild(monthGrid);
    }
    
    // Render the week view calendar
    function renderWeekView(container) {
        const weekGrid = document.createElement('div');
        weekGrid.className = 'week-view';
        
        // Get the start of the week (Sunday)
        const weekStart = new Date(currentViewDate);
        weekStart.setDate(currentViewDate.getDate() - currentViewDate.getDay());
        
        // Create header row with days
        const headerRow = document.createElement('div');
        headerRow.className = 'row mb-2';
        
        // Time column header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'col-1 text-center font-weight-bold';
        timeHeader.textContent = 'Time';
        headerRow.appendChild(timeHeader);
        
        // Day columns headers
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'col text-center font-weight-bold';
            
            const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayDate.getDay()];
            const isToday = dayDate.toDateString() === today.toDateString();
            
            dayHeader.innerHTML = `
                <div>${dayOfWeek}</div>
                <div class="${isToday ? 'text-primary' : ''}">${dayDate.getDate()}</div>
            `;
            
            headerRow.appendChild(dayHeader);
        }
        
        weekGrid.appendChild(headerRow);
        
        // Create time slots (8 AM to 6 PM)
        for (let hour = 8; hour <= 18; hour++) {
            const timeRow = document.createElement('div');
            timeRow.className = 'row mb-2';
            
            // Time label
            const timeLabel = document.createElement('div');
            timeLabel.className = 'col-1 text-center';
            timeLabel.textContent = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
            timeRow.appendChild(timeLabel);
            
            // Day columns
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(weekStart);
                dayDate.setDate(weekStart.getDate() + i);
                dayDate.setHours(hour, 0, 0, 0);
                
                const dayCell = document.createElement('div');
                dayCell.className = 'col p-0';
                
                const hourDiv = document.createElement('div');
                hourDiv.className = 'calendar-hour';
                hourDiv.dataset.date = dayDate.toISOString();
                
                // Add events for this hour
                const events = getEventsForHour(dayDate);
                events.forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = `calendar-event ${event.type === 'appointment' ? 'event-appointment' : 'event-blocked'}`;
                    eventDiv.textContent = event.title;
                    eventDiv.dataset.eventId = event.id;
                    eventDiv.addEventListener('click', () => showEventDetails(event));
                    hourDiv.appendChild(eventDiv);
                });
                
                dayCell.appendChild(hourDiv);
                timeRow.appendChild(dayCell);
            }
            
            weekGrid.appendChild(timeRow);
        }
        
        container.appendChild(weekGrid);
    }
    
    // Render the day view calendar
    function renderDayView(container) {
        const dayGrid = document.createElement('div');
        dayGrid.className = 'day-view';
        
        // Create header
        const headerRow = document.createElement('div');
        headerRow.className = 'row mb-3';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'col-12 text-center';
        
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentViewDate.getDay()];
        dayHeader.innerHTML = `<h4>${dayOfWeek}, ${currentViewDate.toLocaleDateString()}</h4>`;
        
        headerRow.appendChild(dayHeader);
        dayGrid.appendChild(headerRow);
        
        // Create time slots (8 AM to 6 PM)
        for (let hour = 8; hour <= 18; hour++) {
            const timeRow = document.createElement('div');
            timeRow.className = 'row mb-2';
            
            // Time label
            const timeLabel = document.createElement('div');
            timeLabel.className = 'col-2 text-right pr-0';
            timeLabel.textContent = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
            timeRow.appendChild(timeLabel);
            
            // Hour slot
            const hourCell = document.createElement('div');
            hourCell.className = 'col-10';
            
            const hourDiv = document.createElement('div');
            hourDiv.className = 'calendar-hour';
            
            const hourDate = new Date(currentViewDate);
            hourDate.setHours(hour, 0, 0, 0);
            hourDiv.dataset.date = hourDate.toISOString();
            
            // Add events for this hour
            const events = getEventsForHour(hourDate);
            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `calendar-event ${event.type === 'appointment' ? 'event-appointment' : 'event-blocked'}`;
                eventDiv.textContent = event.title;
                eventDiv.dataset.eventId = event.id;
                eventDiv.addEventListener('click', () => showEventDetails(event));
                hourDiv.appendChild(eventDiv);
            });
            
            hourCell.appendChild(hourDiv);
            timeRow.appendChild(hourCell);
            
            dayGrid.appendChild(timeRow);
        }
        
        container.appendChild(dayGrid);
    }
    
    // Get events for a specific date (for month view)
    function getEventsForDate(date) {
        // This would normally fetch from an API
        // For demo purposes, we'll use mock data
        
        // Format date as YYYY-MM-DD for comparison
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        return mockEvents.filter(event => {
            const eventDate = event.start.split('T')[0];
            return eventDate === dateString;
        });
    }
    
    // Get events for a specific hour (for week and day views)
    function getEventsForHour(date) {
        // This would normally fetch from an API
        // For demo purposes, we'll use mock data
        
        // Format date as YYYY-MM-DD for comparison
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const hour = date.getHours();
        
        return mockEvents.filter(event => {
            const eventDate = event.start.split('T')[0];
            const eventHour = parseInt(event.start.split('T')[1].split(':')[0]);
            
            return eventDate === dateString && eventHour === hour;
        });
    }
    
    // Show event details when an event is clicked
    function showEventDetails(event) {
        try {
            if (event.type === 'appointment') {
                // Show appointment details modal
                const modal = document.getElementById('appointmentDetailsModal');
                const modalContent = document.getElementById('appointment-details-content');
                
                if (!modal || !modalContent) return;
                
                // Find the appointment details
                const appointment = mockAppointments.find(a => a.id === event.id);
                
                if (!appointment) {
                    modalContent.innerHTML = '<div class="alert alert-warning">Appointment details not found.</div>';
                } else {
                    // Format the appointment details
                    modalContent.innerHTML = `
                        <div class="appointment-details">
                            <div class="row mb-3">
                                <div class="col-4 font-weight-bold">Patient:</div>
                                <div class="col-8">${appointment.patientName}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-4 font-weight-bold">Date & Time:</div>
                                <div class="col-8">${formatDateTime(appointment.dateTime)}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-4 font-weight-bold">Type:</div>
                                <div class="col-8">${appointment.type}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-4 font-weight-bold">Status:</div>
                                <div class="col-8">
                                    <span class="appointment-status status-${appointment.status.toLowerCase()}"></span>
                                    ${appointment.status}
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-4 font-weight-bold">Notes:</div>
                                <div class="col-8">${appointment.notes || 'No notes available'}</div>
                            </div>
                        </div>
                    `;
                }
                
                // Show the modal
                $(modal).modal('show');
            } else if (event.type === 'blocked') {
                // Show blocked time details
                alert(`Blocked Time: ${event.title}\nReason: ${event.reason}\nPeriod: ${formatDateTime(event.start)} - ${formatDateTime(event.end)}`);
            }
        } catch (error) {
            console.error('Error showing event details:', error);
        }
    }
    
    // Format date and time for display
    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        return date.toLocaleString('en-US', options);
    }
    
    // Load upcoming appointments
    function loadUpcomingAppointments() {
        const appointmentsContainer = document.getElementById('upcoming-appointments');
        if (!appointmentsContainer) return;
        
        // Clear the container
        appointmentsContainer.innerHTML = '';
        
        // Sort appointments by date (newest first)
        const sortedAppointments = [...mockAppointments].sort((a, b) => {
            return new Date(a.dateTime) - new Date(b.dateTime);
        });
        
        // Take only the first 5 appointments
        const upcomingAppointments = sortedAppointments.slice(0, 5);
        
        if (upcomingAppointments.length === 0) {
            appointmentsContainer.innerHTML = '<tr><td colspan="5" class="text-center">No upcoming appointments</td></tr>';
            return;
        }
        
        // Add each appointment to the table
        upcomingAppointments.forEach(appointment => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${appointment.patientName}</td>
                <td>${formatDateTime(appointment.dateTime)}</td>
                <td>${appointment.type}</td>
                <td>
                    <span class="appointment-status status-${appointment.status.toLowerCase()}"></span>
                    ${appointment.status}
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-view-appointment" data-appointment-id="${appointment.id}" title="View Details">
                        <i class="fa fa-eye"></i>
                        <span class="d-none">View Details</span>
                    </button>
                </td>
            `;
            
            appointmentsContainer.appendChild(row);
        });
        
        // Add event listeners to the view buttons
        const viewButtons = appointmentsContainer.querySelectorAll('.btn-view-appointment');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const appointmentId = this.dataset.appointmentId;
                const appointment = mockAppointments.find(a => a.id === appointmentId);
                
                if (appointment) {
                    const event = {
                        id: appointment.id,
                        type: 'appointment',
                        title: `${appointment.patientName} - ${appointment.type}`
                    };
                    
                    showEventDetails(event);
                }
            });
        });
    }
    
    // Load blocked time periods
    function loadBlockedTimePeriods() {
        const blockedTimeList = document.getElementById('blocked-time-list');
        if (!blockedTimeList) return;
        
        // Clear the container
        blockedTimeList.innerHTML = '';
        
        // Filter events to get only blocked times
        const blockedTimes = mockEvents.filter(event => event.type === 'blocked');
        
        if (blockedTimes.length === 0) {
            blockedTimeList.innerHTML = '<li class="list-group-item text-center">No blocked time periods</li>';
            return;
        }
        
        // Sort blocked times by start date
        blockedTimes.sort((a, b) => new Date(a.start) - new Date(b.start));
        
        // Add each blocked time to the list
        blockedTimes.forEach(blockedTime => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item blocked-time-item';
            listItem.dataset.blockId = blockedTime.id;
            
            const startDate = new Date(blockedTime.start);
            const endDate = new Date(blockedTime.end);
            
            listItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="font-weight-bold">${blockedTime.title}</div>
                        <div class="text-muted small">
                            ${formatDateTime(startDate)} - ${formatDateTime(endDate)}
                        </div>
                        <div class="mt-1">
                            <span class="badge badge-secondary">${blockedTime.reason}</span>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger btn-remove-block" title="Remove Block">
                        <i class="fa fa-times"></i>
                        <span class="d-none">Remove Block</span>
                    </button>
                </div>
            `;
            
            blockedTimeList.appendChild(listItem);
        });
        
        // Add event listeners to the remove buttons
        const removeButtons = blockedTimeList.querySelectorAll('.btn-remove-block');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const listItem = this.closest('.blocked-time-item');
                const blockId = listItem.dataset.blockId;
                
                if (confirm('Are you sure you want to remove this blocked time period?')) {
                    // In a real app, this would call an API to remove the block
                    // For demo purposes, we'll just remove it from the UI
                    listItem.remove();
                    
                    // Refresh the calendar to reflect the change
                    renderCalendar();
                }
            });
        });
    }
    
    // Set up event listeners for the page
    function setupEventListeners() {
        try {
            // View toggle buttons
            const viewMonthBtn = document.querySelector('.btn-view-month');
            const viewWeekBtn = document.querySelector('.btn-view-week');
            const viewDayBtn = document.querySelector('.btn-view-day');
            
            if (viewMonthBtn) {
                viewMonthBtn.addEventListener('click', function() {
                    currentView = 'month';
                    updateViewButtons();
                    renderCalendar();
                });
            }
            
            if (viewWeekBtn) {
                viewWeekBtn.addEventListener('click', function() {
                    currentView = 'week';
                    updateViewButtons();
                    renderCalendar();
                });
            }
            
            if (viewDayBtn) {
                viewDayBtn.addEventListener('click', function() {
                    currentView = 'day';
                    updateViewButtons();
                    renderCalendar();
                });
            }
            
            // Navigation buttons
            const prevBtn = document.querySelector('.btn-prev-period');
            const nextBtn = document.querySelector('.btn-next-period');
            const todayBtn = document.querySelector('.btn-today');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    navigatePrevious();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    navigateNext();
                });
            }
            
            if (todayBtn) {
                todayBtn.addEventListener('click', function() {
                    currentViewDate = new Date(today);
                    renderCalendar();
                });
            }
            
            // Block time form
            const blockReasonSelect = document.getElementById('block-reason');
            const otherReasonGroup = document.getElementById('other-reason-group');
            
            if (blockReasonSelect && otherReasonGroup) {
                blockReasonSelect.addEventListener('change', function() {
                    if (this.value === 'other') {
                        otherReasonGroup.style.display = 'block';
                    } else {
                        otherReasonGroup.style.display = 'none';
                    }
                });
            }
            
            // Repeat block checkbox
            const repeatBlockCheckbox = document.getElementById('repeat-block');
            const repeatOptions = document.getElementById('repeat-options');
            
            if (repeatBlockCheckbox && repeatOptions) {
                repeatBlockCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        repeatOptions.style.display = 'block';
                    } else {
                        repeatOptions.style.display = 'none';
                    }
                });
            }
            
            // Save block button
            const saveBlockBtn = document.querySelector('.btn-save-block');
            
            if (saveBlockBtn) {
                saveBlockBtn.addEventListener('click', function() {
                    saveBlockedTime();
                });
            }
            
            // Working hours toggle switches
            const dayToggles = document.querySelectorAll('.custom-switch input[type="checkbox"]');
            
            dayToggles.forEach(toggle => {
                toggle.addEventListener('change', function() {
                    const day = this.id.split('-')[0];
                    const startSelect = document.getElementById(`${day}-start`);
                    const endSelect = document.getElementById(`${day}-end`);
                    
                    if (startSelect && endSelect) {
                        startSelect.disabled = !this.checked;
                        endSelect.disabled = !this.checked;
                    }
                });
            });
            
            // Save working hours form
            const workingHoursForm = document.getElementById('working-hours-form');
            
            if (workingHoursForm) {
                workingHoursForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    saveWorkingHours();
                });
            }
            
            // Sync calendar button
            const syncCalendarBtn = document.querySelector('.btn-sync-calendar');
            
            if (syncCalendarBtn) {
                syncCalendarBtn.addEventListener('click', function() {
                    // In a real app, this would sync with external calendars
                    alert('Calendar synced successfully!');
                });
            }
            
            // Appointment action buttons
            const rescheduleBtn = document.querySelector('.btn-reschedule-appointment');
            const cancelAppointmentBtn = document.querySelector('.btn-cancel-appointment');
            
            if (rescheduleBtn) {
                rescheduleBtn.addEventListener('click', function() {
                    // In a real app, this would open a reschedule form
                    alert('Reschedule functionality would open here');
                    $('#appointmentDetailsModal').modal('hide');
                });
            }
            
            if (cancelAppointmentBtn) {
                cancelAppointmentBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to cancel this appointment?')) {
                        // In a real app, this would call an API to cancel the appointment
                        alert('Appointment cancelled successfully');
                        $('#appointmentDetailsModal').modal('hide');
                        
                        // Refresh the appointments list and calendar
                        loadUpcomingAppointments();
                        renderCalendar();
                    }
                });
            }
            
            // View all appointments button
            const viewAllAppointmentsBtn = document.querySelector('.btn-view-all-appointments');
            
            if (viewAllAppointmentsBtn) {
                viewAllAppointmentsBtn.addEventListener('click', function() {
                    // In a real app, this would navigate to the appointments page
                    alert('This would navigate to the full appointments list page');
                });
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }
    
    // Update the active state of view buttons
    function updateViewButtons() {
        const viewButtons = document.querySelectorAll('.view-toggle .btn');
        
        viewButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`.btn-view-${currentView}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    
    // Navigate to the previous period based on current view
    function navigatePrevious() {
        switch(currentView) {
            case 'month':
                currentViewDate.setMonth(currentViewDate.getMonth() - 1);
                break;
            case 'week':
                currentViewDate.setDate(currentViewDate.getDate() - 7);
                break;
            case 'day':
                currentViewDate.setDate(currentViewDate.getDate() - 1);
                break;
        }
        
        renderCalendar();
    }
    
    // Navigate to the next period based on current view
    function navigateNext() {
        switch(currentView) {
            case 'month':
                currentViewDate.setMonth(currentViewDate.getMonth() + 1);
                break;
            case 'week':
                currentViewDate.setDate(currentViewDate.getDate() + 7);
                break;
            case 'day':
                currentViewDate.setDate(currentViewDate.getDate() + 1);
                break;
        }
        
        renderCalendar();
    }
    
    // Save blocked time
    function saveBlockedTime() {
        try {
            const reason = document.getElementById('block-reason').value;
            const otherReason = document.getElementById('other-reason')?.value;
            const startDate = document.getElementById('block-start-date').value;
            const startTime = document.getElementById('block-start-time').value;
            const endDate = document.getElementById('block-end-date').value;
            const endTime = document.getElementById('block-end-time').value;
            const notes = document.getElementById('block-notes').value;
            const repeatBlock = document.getElementById('repeat-block').checked;
            
            // Validate inputs
            if (!startDate || !startTime || !endDate || !endTime) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Create start and end datetime strings
            const start = `${startDate}T${startTime}:00`;
            const end = `${endDate}T${endTime}:00`;
            
            // Validate that end is after start
            if (new Date(end) <= new Date(start)) {
                alert('End time must be after start time');
                return;
            }
            
            // In a real app, this would call an API to save the blocked time
            // For demo purposes, we'll just show a success message
            alert('Time block saved successfully!');
            
            // Close the modal
            $('#blockTimeModal').modal('hide');
            
            // Reset the form
            document.getElementById('block-time-form').reset();
            document.getElementById('other-reason-group').style.display = 'none';
            document.getElementById('repeat-options').style.display = 'none';
            
            // Refresh the calendar and blocked time list
            renderCalendar();
            loadBlockedTimePeriods();
        } catch (error) {
            console.error('Error saving blocked time:', error);
            alert('An error occurred while saving the blocked time');
        }
    }
    
    // Save working hours
    function saveWorkingHours() {
        try {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const workingHours = {};
            
            days.forEach(day => {
                const isEnabled = document.getElementById(`${day}-toggle`).checked;
                
                if (isEnabled) {
                    const start = document.getElementById(`${day}-start`).value;
                    const end = document.getElementById(`${day}-end`).value;
                    
                    workingHours[day] = { start, end };
                } else {
                    workingHours[day] = null; // Day is off
                }
            });
            
            // In a real app, this would call an API to save the working hours
            // For demo purposes, we'll just show a success message
            alert('Working hours saved successfully!');
            
            // Refresh the calendar
            renderCalendar();
        } catch (error) {
            console.error('Error saving working hours:', error);
            alert('An error occurred while saving working hours');
        }
    }
    
    // Mock data for events (appointments and blocked times)
    const mockEvents = [
        {
            id: 'appt1',
            type: 'appointment',
            title: 'John Smith - Check-up',
            start: '2023-08-15T09:00:00',
            end: '2023-08-15T09:30:00'
        },
        {
            id: 'appt2',
            type: 'appointment',
            title: 'Jane Doe - Consultation',
            start: '2023-08-15T10:00:00',
            end: '2023-08-15T10:30:00'
        },
        {
            id: 'appt3',
            type: 'appointment',
            title: 'Bob Johnson - Follow-up',
            start: '2023-08-16T14:00:00',
            end: '2023-08-16T14:30:00'
        },
        {
            id: 'appt4',
            type: 'appointment',
            title: 'Sarah Williams - New Patient',
            start: '2023-08-17T11:00:00',
            end: '2023-08-17T12:00:00'
        },
        {
            id: 'block1',
            type: 'blocked',
            title: 'Lunch Break',
            reason: 'personal',
            start: '2023-08-15T12:00:00',
            end: '2023-08-15T13:00:00'
        },
        {
            id: 'block2',
            type: 'blocked',
            title: 'Staff Meeting',
            reason: 'meeting',
            start: '2023-08-16T09:00:00',
            end: '2023-08-16T10:00:00'
        },
        {
            id: 'block3',
            type: 'blocked',
            title: 'Vacation',
            reason: 'vacation',
            start: '2023-08-21T08:00:00',
            end: '2023-08-25T18:00:00'
        }
    ];
    
    // Mock data for appointments
    const mockAppointments = [
        {
            id: 'appt1',
            patientName: 'John Smith',
            dateTime: '2023-08-15T09:00:00',
            type: 'Check-up',
            status: 'Confirmed',
            notes: 'Annual physical examination'
        },
        {
            id: 'appt2',
            patientName: 'Jane Doe',
            dateTime: '2023-08-15T10:00:00',
            type: 'Consultation',
            status: 'Confirmed',
            notes: 'Discussing treatment options'
        },
        {
            id: 'appt3',
            patientName: 'Bob Johnson',
            dateTime: '2023-08-16T14:00:00',
            type: 'Follow-up',
            status: 'Pending',
            notes: 'Post-surgery follow-up'
        },
        {
            id: 'appt4',
            patientName: 'Sarah Williams',
            dateTime: '2023-08-17T11:00:00',
            type: 'New Patient',
            status: 'Confirmed',
            notes: 'Initial consultation'
        },
        {
            id: 'appt5',
            patientName: 'Michael Brown',
            dateTime: '2023-08-18T15:30:00',
            type: 'Check-up',
            status: 'Cancelled',
            notes: 'Patient requested cancellation'
        }
    ];
});
