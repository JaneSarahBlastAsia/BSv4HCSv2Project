$(document).ready(function() {
    // Initialize tooltips
    try {
        $('[data-toggle="tooltip"]').tooltip();
    } catch (error) {
        console.error("Error initializing tooltips:", error);
    }

    // View toggle functionality
    $("#list-view-btn").click(function() {
        try {
            $("#list-view").show();
            $("#calendar-view").hide();
            $("#list-view-btn").addClass("active");
            $("#calendar-view-btn").removeClass("active");
        } catch (error) {
            console.error("Error toggling to list view:", error);
        }
    });

    $("#calendar-view-btn").click(function() {
        try {
            $("#calendar-view").show();
            $("#list-view").hide();
            $("#calendar-view-btn").addClass("active");
            $("#list-view-btn").removeClass("active");
        } catch (error) {
            console.error("Error toggling to calendar view:", error);
        }
    });

    // Search functionality for appointments
    $(".search-upcoming").on("keyup", function() {
        try {
            const value = $(this).val().toLowerCase();
            $("#upcoming .appointment-card").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        } catch (error) {
            console.error("Error searching upcoming appointments:", error);
        }
    });

    $(".search-past").on("keyup", function() {
        try {
            const value = $(this).val().toLowerCase();
            $("#past .appointment-card").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        } catch (error) {
            console.error("Error searching past appointments:", error);
        }
    });

    $(".search-cancelled").on("keyup", function() {
        try {
            const value = $(this).val().toLowerCase();
            $("#cancelled .appointment-card").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        } catch (error) {
            console.error("Error searching cancelled appointments:", error);
        }
    });

    // View appointment details
    $(".btn-view-details").click(function() {
        try {
            const appointmentId = $(this).data("appointment-id");
            
            // In a real application, you would fetch the appointment details from the server
            // For demo purposes, we'll use the data already in the DOM
            
            // Get appointment data from the card
            const card = $(this).closest(".appointment-card");
            const doctorName = card.find(".doctor-name").text();
            const date = card.find(".month").text() + " " + card.find(".day").text() + ", " + card.find(".year").text();
            const time = card.find(".appointment-time").text();
            
            // Populate modal with appointment data
            $("#appointmentDetailsModal .doctor-name-modal").text(doctorName);
            $("#appointmentDetailsModal .appointment-date-modal").text(date);
            $("#appointmentDetailsModal .appointment-time-modal").text(time + " - " + (parseInt(time.split(":")[0]) + 1) + ":" + time.split(":")[1]);
            
            // Show the modal
            $("#appointmentDetailsModal").modal("show");
            
            // In a real application, you would make an API call like:
            /*
            $.ajax({
                url: '/api/appointments/' + appointmentId,
                method: 'GET',
                success: function(data) {
                    // Populate modal with data
                    $("#appointmentDetailsModal .doctor-name-modal").text(data.doctorName);
                    // ... populate other fields
                    $("#appointmentDetailsModal").modal("show");
                },
                error: function(error) {
                    console.error("Error fetching appointment details:", error);
                    alert("Could not load appointment details. Please try again.");
                }
            });
            */
        } catch (error) {
            console.error("Error viewing appointment details:", error);
            alert("Could not load appointment details. Please try again.");
        }
    });

    // Cancel appointment button click
    $(".btn-cancel, .btn-cancel-modal").click(function() {
        try {
            const appointmentId = $(this).data("appointment-id") || 
                                 $(this).closest(".modal").find(".appointment-id-modal").text();
            
            // Get appointment data for confirmation modal
            let doctorName, appointmentDate, appointmentTime;
            
            if ($(this).hasClass("btn-cancel-modal")) {
                // If clicked from details modal
                doctorName = $("#appointmentDetailsModal .doctor-name-modal").text();
                appointmentDate = $("#appointmentDetailsModal .appointment-date-modal").text();
                appointmentTime = $("#appointmentDetailsModal .appointment-time-modal").text().split(" - ")[0];
                
                // Close the details modal
                $("#appointmentDetailsModal").modal("hide");
            } else {
                // If clicked from appointment card
                const card = $(this).closest(".appointment-card");
                doctorName = card.find(".doctor-name").text();
                appointmentDate = card.find(".month").text() + " " + card.find(".day").text() + ", " + card.find(".year").text();
                appointmentTime = card.find(".appointment-time").text();
            }
            
            // Populate cancel confirmation modal
            $(".cancel-doctor-name").text(doctorName);
            $(".cancel-appointment-date").text(appointmentDate);
            $(".cancel-appointment-time").text(appointmentTime);
            
            // Show the cancel confirmation modal
            $("#cancelConfirmationModal").modal("show");
        } catch (error) {
            console.error("Error preparing cancel modal:", error);
            alert("Could not prepare cancellation. Please try again.");
        }
    });

    // Handle cancel reason selection
    $("#cancelReason").change(function() {
        try {
            if ($(this).val() === "other") {
                $("#otherReasonGroup").show();
            } else {
                $("#otherReasonGroup").hide();
            }
        } catch (error) {
            console.error("Error handling cancel reason selection:", error);
        }
    });

    // Confirm cancellation
    $(".btn-confirm-cancel").click(function() {
        try {
            const reason = $("#cancelReason").val();
            const otherReason = $("#otherReason").val();
            
            if (!reason) {
                alert("Please select a reason for cancellation.");
                return;
            }
            
            if (reason === "other" && !otherReason) {
                alert("Please specify your reason for cancellation.");
                return;
            }
            
            // In a real application, you would make an API call to cancel the appointment
            /*
            $.ajax({
                url: '/api/appointments/cancel',
                method: 'POST',
                data: {
                    appointmentId: currentAppointmentId,
                    reason: reason === "other" ? otherReason : reason
                },
                success: function(response) {
                    // Handle successful cancellation
                    $("#cancelConfirmationModal").modal("hide");
                    alert("Appointment cancelled successfully.");
                    // Refresh the appointments list or update the UI
                    location.reload();
                },
                error: function(error) {
                    console.error("Error cancelling appointment:", error);
                    alert("Could not cancel appointment. Please try again.");
                }
            });
            */
            
            // For demo purposes, just close the modal and show a success message
            $("#cancelConfirmationModal").modal("hide");
            alert("Appointment cancelled successfully.");
        } catch (error) {
            console.error("Error confirming cancellation:", error);
            alert("Could not cancel appointment. Please try again.");
        }
    });

    // Book new appointment button
    $(".btn-book-appointment").click(function() {
        try {
            // In a real application, you would redirect to the booking page
            alert("Redirecting to appointment booking page...");
            // window.location.href = "/book-appointment";
        } catch (error) {
            console.error("Error navigating to booking page:", error);
        }
    });

    // Reschedule appointment
    $(".btn-reschedule, .btn-reschedule-modal").click(function() {
        try {
            const appointmentId = $(this).data("appointment-id") || 
                                 $(this).closest(".modal").find(".appointment-id-modal").text();
            
            // In a real application, you would redirect to the rescheduling page with the appointment ID
            alert("Redirecting to reschedule page for appointment...");
            // window.location.href = "/reschedule-appointment?id=" + appointmentId;
        } catch (error) {
            console.error("Error navigating to reschedule page:", error);
        }
    });

    // Book similar appointment
    $(".btn-book-similar").click(function() {
        try {
            const appointmentId = $(this).data("appointment-id");
            
            // In a real application, you would redirect to the booking page with pre-filled information
            alert("Redirecting to book a similar appointment...");
            // window.location.href = "/book-appointment?template=" + appointmentId;
        } catch (error) {
            console.error("Error navigating to book similar page:", error);
        }
    });

    // Calendar navigation
    $(".btn-prev-month").click(function() {
        try {
            alert("Navigate to previous month");
            // In a real application, you would update the calendar view
        } catch (error) {
            console.error("Error navigating to previous month:", error);
        }
    });

    $(".btn-next-month").click(function() {
        try {
            alert("Navigate to next month");
            // In a real application, you would update the calendar view
        } catch (error) {
            console.error("Error navigating to next month:", error);
        }
    });

    $(".btn-today").click(function() {
        try {
            alert("Navigate to current month");
            // In a real application, you would update the calendar view to show the current month
        } catch (error) {
            console.error("Error navigating to current month:", error);
        }
    });

    // Calendar day click
    $(".calendar-day").click(function() {
        try {
            const day = $(this).text().trim().split("\n")[0];
            if ($(this).hasClass("has-appointment")) {
                // If the day has an appointment, show the appointment details
                alert("Show appointments for day " + day);
                // In a real application, you would show the appointments for that day
            }
        } catch (error) {
            console.error("Error handling calendar day click:", error);
        }
    });
});
