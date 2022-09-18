// POST /api/returns {customerId, movieId}

// Returns 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 rental is already processed 
// Return 200 if valid request
// Set the return date
// Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
// Increase the stock
// Return the rental