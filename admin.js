  
    
    $('#insertTreatmentForm').submit(function(event) {
        event.preventDefault(); 
        const treatmentData = $(this).serialize(); 
        $.ajax({
            url: '/insertTreatment', 
            method: 'POST',
            data: treatmentData,
            success: function(response) {
                console.log("Treatment inserted:", response);
                fetchTreatmentList();
            },
            error: function(error) {
                console.error("Error inserting treatment:", error);
            }
        });
    })
  