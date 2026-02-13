document.addEventListener('DOMContentLoaded', () => {

    const studentOrderForm = document.getElementById('studentOrderForm');
    const studentFileInput = document.getElementById('student-file-upload');
    const studentFileNameDisplay = document.getElementById('student-file-name');
    const studentSuccessModal = document.getElementById('studentSuccessModal');

    // --- File Input ---
    if (studentFileInput) {
        studentFileInput.addEventListener('change', function (e) {
            const files = e.target.files;
            if (files.length > 0) {
                if (studentFileNameDisplay) {
                    studentFileNameDisplay.textContent = "Selected: " + files[0].name;
                    studentFileNameDisplay.classList.remove('hidden');
                }
            } else {
                if (studentFileNameDisplay) studentFileNameDisplay.classList.add('hidden');
            }
        });
    }

    // Explicit Close Function
    window.closeStudentModal = function () {
        if (studentSuccessModal) {
            studentSuccessModal.classList.add('hidden');
            window.location.href = 'index.html';
        }
    };

    // --- Form Submit ---
    if (studentOrderForm) {
        studentOrderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form elements
            const nameInput = document.getElementById('studentName');
            const uniInput = document.getElementById('university');
            const idInput = document.getElementById('studentId');
            const mobileInput = document.getElementById('studentMobile');

            if (!nameInput || !uniInput || !idInput || !mobileInput || !studentFileInput) {
                alert("Please fill all fields.");
                return;
            }

            const nameVal = nameInput.value;
            const uniVal = uniInput.value;
            const idVal = idInput.value;
            const mobileVal = mobileInput.value;
            const file = studentFileInput.files[0];
            const submitBtn = studentOrderForm.querySelector('button[type="submit"]');

            if (!file) {
                alert("Please upload the discounted payment slip.");
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Verifying Student ID...';
            submitBtn.disabled = true;

            const reader = new FileReader();

            reader.onload = function (evt) {
                const base64 = evt.target.result;

                const studentOrder = {
                    id: Date.now(),
                    isStudent: true,
                    date: new Date().toISOString(),
                    name: nameVal + " (Student)",
                    university: uniVal,
                    studentId: idVal,
                    mobile: mobileVal,
                    address: uniVal + ", ID: " + idVal,
                    slipImage: base64
                };

                try {
                    // Send to Cloud Database
                    DATABASE.saveOrder(studentOrder).then(success => {
                        console.log("Student Cloud sync result:", success);

                        setTimeout(() => {
                            if (studentSuccessModal) studentSuccessModal.classList.remove('hidden');
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            studentOrderForm.reset();
                            if (studentFileNameDisplay) studentFileNameDisplay.classList.add('hidden');
                        }, 500);
                    });

                } catch (err) {
                    console.error("Submission Error", err);
                    alert("Something went wrong. Please check your internet connection.");
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            };

            reader.readAsDataURL(file);
        });
    }
});
