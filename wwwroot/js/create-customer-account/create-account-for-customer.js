$(document).ready(function() {
    // Initialize form validation
    const form = document.getElementById('registration-form');
    
    // Generate random captcha
    generateCaptcha();
    
    // Handle payment method change
    $('input[name="paymentMethod"]').change(function() {
        if ($(this).val() === 'bank') {
            $('#card-payment-fields').hide();
            $('#bank-payment-fields').show();
        } else {
            $('#card-payment-fields').show();
            $('#bank-payment-fields').hide();
        }
    });
    
    // Handle step navigation
    $('.btn-next-step-1').click(function() {
        if (validateStep1()) {
            goToStep(2);
        }
    });
    
    $('.btn-prev-step-2').click(function() {
        goToStep(1);
    });
    
    $('.btn-next-step-2').click(function() {
        if (validateStep2()) {
            goToStep(3);
        }
    });
    
    $('.btn-prev-step-3').click(function() {
        goToStep(2);
    });
    
    // Refresh captcha
    $('.btn-refresh-captcha').click(function(e) {
        e.preventDefault();
        generateCaptcha();
    });
    
    // Form submission
    $('#registration-form').submit(function(e) {
        e.preventDefault();
        
        if (validateStep3()) {
            submitForm();
        }
    });
    
    // Go to login button
    $('.btn-go-to-login').click(function() {
        // Redirect to login page
        window.location.href = "/login";
    });
    
    // Input validation functions
    function validateStep1() {
        let isValid = true;
        
        // First Name validation
        const firstName = $('#firstName');
        if (firstName.val().trim() === '') {
            firstName.addClass('is-invalid');
            isValid = false;
        } else {
            firstName.removeClass('is-invalid');
        }
        
        // Last Name validation
        const lastName = $('#lastName');
        if (lastName.val().trim() === '') {
            lastName.addClass('is-invalid');
            isValid = false;
        } else {
            lastName.removeClass('is-invalid');
        }
        
        // Email validation
        const email = $('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.val().trim())) {
            email.addClass('is-invalid');
            isValid = false;
        } else {
            email.removeClass('is-invalid');
        }
        
        // Phone validation
        const phone = $('#phone');
        if (phone.val().trim() === '') {
            phone.addClass('is-invalid');
            isValid = false;
        } else {
            phone.removeClass('is-invalid');
        }
        
        // Password validation
        const password = $('#password');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password.val())) {
            password.addClass('is-invalid');
            isValid = false;
        } else {
            password.removeClass('is-invalid');
        }
        
        // Confirm Password validation
        const confirmPassword = $('#confirmPassword');
        if (confirmPassword.val() !== password.val()) {
            confirmPassword.addClass('is-invalid');
            isValid = false;
        } else {
            confirmPassword.removeClass('is-invalid');
        }
        
        return isValid;
    }
    
    function validateStep2() {
        let isValid = true;
        
        // Address validation
        const address = $('#address');
        if (address.val().trim() === '') {
            address.addClass('is-invalid');
            isValid = false;
        } else {
            address.removeClass('is-invalid');
        }
        
        // City validation
        const city = $('#city');
        if (city.val().trim() === '') {
            city.addClass('is-invalid');
            isValid = false;
        } else {
            city.removeClass('is-invalid');
        }
        
        // State validation
        const state = $('#state');
        if (state.val() === null || state.val() === '') {
            state.addClass('is-invalid');
            isValid = false;
        } else {
            state.removeClass('is-invalid');
        }
        
        // Zip validation
        const zip = $('#zip');
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(zip.val().trim())) {
            zip.addClass('is-invalid');
            isValid = false;
        } else {
            zip.removeClass('is-invalid');
        }
        
        return isValid;
    }
    
    function validateStep3() {
        let isValid = true;
        
        // Payment method validation
        const paymentMethod = $('input[name="paymentMethod"]:checked').val();
        
        if (paymentMethod === 'credit' || paymentMethod === 'debit') {
            // Card Name validation
            const cardName = $('#cardName');
            if (cardName.val().trim() === '') {
                cardName.addClass('is-invalid');
                isValid = false;
            } else {
                cardName.removeClass('is-invalid');
            }
            
            // Card Number validation
            const cardNumber = $('#cardNumber');
            const cardNumberRegex = /^\d{16}$/;
            if (!cardNumberRegex.test(cardNumber.val().replace(/\s/g, ''))) {
                cardNumber.addClass('is-invalid');
                isValid = false;
            } else {
                cardNumber.removeClass('is-invalid');
            }
            
            // Expiration Date validation
            const expDate = $('#expDate');
            const expDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expDateRegex.test(expDate.val().trim())) {
                expDate.addClass('is-invalid');
                isValid = false;
            } else {
                expDate.removeClass('is-invalid');
            }
            
            // CVV validation
            const cvv = $('#cvv');
            const cvvRegex = /^\d{3,4}$/;
            if (!cvvRegex.test(cvv.val().trim())) {
                cvv.addClass('is-invalid');
                isValid = false;
            } else {
                cvv.removeClass('is-invalid');
            }
        } else if (paymentMethod === 'bank') {
            // Account Name validation
            const accountName = $('#accountName');
            if (accountName.val().trim() === '') {
                accountName.addClass('is-invalid');
                isValid = false;
            } else {
                accountName.removeClass('is-invalid');
            }
            
            // Routing Number validation
            const routingNumber = $('#routingNumber');
            const routingRegex = /^\d{9}$/;
            if (!routingRegex.test(routingNumber.val().trim())) {
                routingNumber.addClass('is-invalid');
                isValid = false;
            } else {
                routingNumber.removeClass('is-invalid');
            }
            
            // Account Number validation
            const accountNumber = $('#accountNumber');
            const accountRegex = /^\d{10,17}$/;
            if (!accountRegex.test(accountNumber.val().trim())) {
                accountNumber.addClass('is-invalid');
                isValid = false;
            } else {
                accountNumber.removeClass('is-invalid');
            }
            
            // Account Type validation
            const accountType = $('#accountType');
            if (accountType.val() === null || accountType.val() === '') {
                accountType.addClass('is-invalid');
                isValid = false;
            } else {
                accountType.removeClass('is-invalid');
            }
        }
        
        // Terms validation
        const terms = $('#terms');
        if (!terms.prop('checked')) {
            terms.addClass('is-invalid');
            isValid = false;
        } else {
            terms.removeClass('is-invalid');
        }
        
        // Captcha validation
        const captchaInput = $('#captcha-input');
        const captchaCode = $('#captcha-code').text();
        if (captchaInput.val().trim() !== captchaCode) {
            captchaInput.addClass('is-invalid');
            isValid = false;
        } else {
            captchaInput.removeClass('is-invalid');
        }
        
        return isValid;
    }
    
    // Helper functions
    function goToStep(step) {
        $('.form-step').removeClass('active');
        $(`#step-${step}`).addClass('active');
        
        // Update progress bar
        const progressPercentage = ((step - 1) / 2) * 100;
        $('#registration-progress').css('width', `${progressPercentage}%`).attr('aria-valuenow', progressPercentage);
        $('#registration-progress').text(`Step ${step} of 3`);
    }
    
    function generateCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        $('#captcha-code').text(captcha);
    }
    
    function submitForm() {
        try {
            // Collect form data
            const formData = {
                personalInfo: {
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    email: $('#email').val(),
                    phone: $('#phone').val()
                },
                address: {
                    street: $('#address').val(),
                    apt: $('#address2').val(),
                    city: $('#city').val(),
                    state: $('#state').val(),
                    zip: $('#zip').val()
                },
                payment: {
                    method: $('input[name="paymentMethod"]:checked').val()
                }
            };
            
            // Add payment details based on selected method
            if (formData.payment.method === 'credit' || formData.payment.method === 'debit') {
                formData.payment.card = {
                    name: $('#cardName').val(),
                    number: $('#cardNumber').val(),
                    expiration: $('#expDate').val(),
                    cvv: $('#cvv').val()
                };
            } else if (formData.payment.method === 'bank') {
                formData.payment.bank = {
                    accountName: $('#accountName').val(),
                    routingNumber: $('#routingNumber').val(),
                    accountNumber: $('#accountNumber').val(),
                    accountType: $('#accountType').val()
                };
            }
            
            // In a real application, you would send this data to your server
            console.log('Form data to submit:', formData);
            
            /*
            // Actual API call (commented out)
            $.ajax({
                url: '/api/customers/register',
                type: 'POST',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function(response) {
                    // Show success modal
                    $('#successModal').modal('show');
                },
                error: function(error) {
                    alert('An error occurred. Please try again.');
                    console.error('Registration error:', error);
                }
            });
            */
            
            // For demo purposes, just show the success modal
            setTimeout(function() {
                $('#successModal').modal('show');
            }, 1000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }
    
    // Format credit card number with spaces
    $('#cardNumber').on('input', function() {
        let value = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        $(this).val(formattedValue);
    });
    
    // Format expiration date
    $('#expDate').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        $(this).val(value);
    });
});
