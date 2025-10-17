$(document).ready(function() {
    // Initialize variables to store selections
    let selectedSpecialization = null;
    let selectedProvider = null;
    let selectedDate = null;
    let selectedTime = null;
    let appointmentReason = null;
    
    // Update progress bar based on current step
    function updateProgressBar(step) {
        const percentage = step * 25;
        $('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage);
        $('.progress-bar').text('Step ' + step + ' of 4');
    }
    
    // Navigation between steps
    $('.step-link').on('click', function(e) {
        e.preventDefault();
        
        // Only allow navigation to completed steps or the next available step
        const clickedStep = parseInt($(this).data('step'));
        const currentStep = $('.booking-step.active').index() + 1;
        
        if (clickedStep < currentStep || (clickedStep === currentStep + 1 && canProceedToNextStep(currentStep))) {
            navigateToStep(clickedStep);
        }
    });
    
    // Next button click
    $('.btn-next').on('click', function() {
        const nextStep = parseInt($(this).data('next'));
        navigateToStep(nextStep);
    });
    
    // Previous button click
    $('.btn-prev').on('click', function() {
        const prevStep = parseInt($(this).data('prev'));
        navigateToStep(prevStep);
    });
    
    // Navigate to specific step
    function navigateToStep(stepNumber) {
        // Hide all steps
        $('.booking-step').removeClass('active');
        
        // Show the target step
        $('#step' + stepNumber).addClass('active');
        
        // Update progress bar
        updateProgressBar(stepNumber);
        
        // Update step pills
        $('.step-link').removeClass('active');
        $('.step-link[data-step="' + stepNumber + '"]').addClass('active');
        
        // Scroll to top of the step
        $('html, body').animate({
            scrollTop: $('#step' + stepNumber).offset().top - 100
        }, 500);
    }
    
    // Check if user can proceed to next step
    function canProceedToNextStep(currentStep) {
        switch(currentStep) {
            case 1:
                return selectedSpecialization !== null;
            case 2:
                return selectedProvider !== null;
            case 3:
                return selectedDate !== null && selectedTime !== null;
            default:
                return false;
        }
    }
    
    // Specialization selection
    $('.specialization-card').on('click', function() {
        $('.specialization-card').removeClass('selected');
        $(this).addClass('selected');
        
        selectedSpecialization = {
            id: $(this).data('id'),
            name: $(this).data('name')
        };
        
        // Update UI
        $('.selected-specialization').text(selectedSpecialization.name);
        
        // Enable next button
        $('.btn-next[data-next="2"]').prop('disabled', false);
    });
    
    // Provider selection
    $('.select-provider').on('click', function() {
        $('.provider-card').removeClass('selected');
        $(this).closest('.provider-card').addClass('selected');
        
        selectedProvider = {
            id: $(this).data('id'),
            name: $(this).data('name')
        };
        
        // Update UI
        $('.selected-provider').text(selectedProvider.name);
        
        // Enable next button
        $('.btn-next[data-next="3"]').prop('disabled', false);
    });
    
    // Initialize calendar
    try {
        // This would be replaced with actual calendar initialization
        // For demo purposes, we're just simulating it
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Simulate calendar initialization
        $('#appointment-calendar').html(`
            <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
                <button class="btn btn-sm btn-outline-secondary prev-month">
                    <i class="fa fa-chevron-left"></i>
                    <span class="d-none">Previous Month</span>
                </button>
                <h5 class="mb-0">${getMonthName(currentMonth)} ${currentYear}</h5>
                <button class="btn btn-sm btn-outline-secondary next-month">
                    <i class="fa fa-chevron-right"></i>
                    <span class="d-none">Next Month</span>
                </button>
            </div>
            <table class="table table-bordered table-sm calendar-table">
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-muted">28</td>
                        <td class="text-muted">29</td>
                        <td class="text-muted">30</td>
                        <td class="text-muted">31</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>12</td>
                        <td>13</td>
                        <td>14</td>
                        <td class="bg-primary text-white calendar-day" data-date="2023-06-15">15</td>
                        <td>16</td>
                        <td>17</td>
                    </tr>
                    <tr>
                        <td>18</td>
                        <td>19</td>
                        <td>20</td>
                        <td>21</td>
                        <td>22</td>
                        <td>23</td>
                        <td>24</td>
                    </tr>
                    <tr>
                        <td>25</td>
                        <td>26</td>
                        <td>27</td>
                        <td>28</td>
                        <td>29</td>
                        <td>30</td>
                        <td class="text-muted">1</td>
                    </tr>
                </tbody>
            </table>
        `);
        
        // Helper function to get month name
        function getMonthName(monthIndex) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
            return months[monthIndex];
        }
    } catch (error) {
        console.error('Error initializing calendar:', error);
        $('#appointment-calendar').html('<div class="alert alert-danger">Error loading calendar. Please try again.</div>');
    }
    
    // Calendar day selection
    $(document).on('click', '.calendar-day', function() {
        $('.calendar-day').removeClass('bg-primary text-white').addClass('bg-light');
        $(this).removeClass('bg-light').addClass('bg-primary text-white');
        
        selectedDate = $(this).data('date');
        
        // Update confirmation UI
        $('.confirm-date').text('June 15, 2023'); // Hardcoded for demo
        
        // Check if we can enable the next button
        if (selectedTime) {
            $('.btn-next[data-next="4"]').prop('disabled', false);
        }
    });
    
    // Time slot selection
    $('input[name="timeSlot"]').on('change', function() {
        selectedTime = $(this).val();
        
        // Format time for display
        const timeDisplay = formatTimeForDisplay(selectedTime);
        
        // Update confirmation UI
        $('.confirm-time').text(timeDisplay);
        
        // Check if we can enable the next button
        if (selectedDate) {
            $('.btn-next[data-next="4"]').prop('disabled', false);
        }
    });
    
    // Format time for display (convert 24h to 12h format)
    function formatTimeForDisplay(time24h) {
        try {
            const [hours, minutes] = time24h.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (error) {
            console.error('Error formatting time:', error);
            return time24h;
        }
    }
    
    // Appointment reason
    $('#appointment-reason').on('input', function() {
        appointmentReason = $(this).val();
        $('.confirm-reason').text(appointmentReason || 'Not specified');
    });
    
    // Terms checkbox
    $('#terms-checkbox').on('change', function() {
        $('.btn-confirm-booking').prop('disabled', !this.checked);
    });
    
    // Confirm booking
    $('.btn-confirm-booking').on('click', function() {
        try {
            // Here you would normally make an API call to save the appointment
            // For demo purposes, we'll just show the success modal
            
            // Prepare appointment data
            const appointmentData = {
                specializationId: selectedSpecialization.id,
                specializationName: selectedSpecialization.name,
                providerId: selectedProvider.id,
                providerName: selectedProvider.name,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                reason: appointmentReason
            };
            
            console.log('Booking appointment with data:', appointmentData);
            
            /* 
            // Actual API call would look something like this:
            $.ajax({
                url: '/api/appointments',
                type: 'POST',
                data: JSON.stringify(appointmentData),
                contentType: 'application/json',
                success: function(response) {
                    // Show success modal
                    $('#successModal').modal('show');
                },
                error: function(error) {
                    alert('Error booking appointment. Please try again.');
                    console.error('Error booking appointment:', error);
                }
            });
            */
            
            // For demo, just show the success modal
            $('.appointment-confirmation-details').text(
                `You will see ${selectedProvider.name} on June 15, 2023 at ${formatTimeForDisplay(selectedTime)}.`
            );
            $('#successModal').modal('show');
        } catch (error) {
            console.error('Error confirming booking:', error);
            alert('An error occurred while confirming your booking. Please try again.');
        }
    });
    
    // View appointments button in success modal
    $('.view-appointments').on('click', function() {
        // Redirect to appointments page
        // window.location.href = '/my-appointments';
        alert('Redirecting to My Appointments page...');
    });
    
    // Filter providers
    $('#filter-providers').on('change', function() {
        const filterValue = $(this).val();
        
        // This would normally filter the providers based on the selected value
        // For demo purposes, we're just logging the filter value
        console.log('Filtering providers by:', filterValue);
    });
    
    // Search specializations
    $('#specialization-search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.specialization-card').each(function() {
            const specializationName = $(this).data('name').toLowerCase();
            if (specializationName.includes(searchTerm)) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
            }
        });
    });
    
    // Search providers
    $('#provider-search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.provider-card').each(function() {
            const providerName = $(this).find('.card-title').text().toLowerCase();
            if (providerName.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
