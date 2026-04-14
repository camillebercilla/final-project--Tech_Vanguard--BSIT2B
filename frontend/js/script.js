function searchTrip() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const date = document.getElementById("date").value;

  if (!from || !to || !date) {
    alert("Please fill in all fields!");
    return;
  }

  alert(`Searching trips from ${from} to ${to} on ${date}`);
}