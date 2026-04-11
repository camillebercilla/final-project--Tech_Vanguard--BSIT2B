document.addEventListener("DOMContentLoaded", () => {

  // ✅ TAB SWITCHING
  const tabs = document.querySelectorAll(".tabs button");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // ✅ SEAT SELECTION
  document.querySelectorAll(".seat").forEach(seat => {
    seat.addEventListener("click", () => {
      document.getElementById("sumSeat").innerText = seat.innerText;
    });
  });

});


// ✅ DISPLAY TRIPS
function displayTrips(trips) {
  const container = document.getElementById("tripResults");
  container.innerHTML = "";

  trips.forEach(trip => {
    container.innerHTML += `
      <div class="trip-card">
        <h5>${trip.origin} → ${trip.destination}</h5>
        <p>Time: ${trip.departureTime}</p>
        <p>Price: ₱${trip.price}</p>
        <button onclick="selectTrip('${trip.origin}', '${trip.destination}', '${trip.departureTime}')">
          Book Now
        </button>
      </div>
    `;
  });
}


// ✅ SELECT TRIP (FIXED — now uses real data)
function selectTrip(from, to, date) {
  document.getElementById("bookingSummary").classList.remove("d-none");

  document.getElementById("sumFrom").innerText = from;
  document.getElementById("sumTo").innerText = to;
  document.getElementById("sumDate").innerText = date;
}


// ✅ TEST DATA (so you SEE something)
function searchTrips() {
  const trips = [
    {
      origin: "Los Angeles",
      destination: "San Diego",
      departureTime: "08:00 AM",
      price: 500
    },
    {
      origin: "Los Angeles",
      destination: "San Diego",
      departureTime: "01:00 PM",
      price: 650
    }
  ];

  displayTrips(trips);
}