const tanggalInput = document.getElementById("tanggal");
const tanggalTerbooking = document.getElementById("tanggalTerbooking");

const fetchBookedDates = async () => {
  const res = await fetch("https://script.google.com/macros/s/AKfycbx9MHoGEYKGcebU93XkKD2zmLzPw182X9163BsXOg9pvrKDpNzNsNWnuotyuMVCR3Fk/exec");
  const result = await res.json();
  const bookedDates = result.bookedDates || [];

  tanggalInput.addEventListener("change", () => {
    const selected = tanggalInput.value;
    if (bookedDates.includes(selected)) {
      tanggalInput.setCustomValidity("Tanggal sudah dibooking, silakan pilih tanggal lain.");
      tanggalTerbooking.textContent = `Tanggal ${selected} sudah dibooking.`;
    } else {
      tanggalInput.setCustomValidity("");
      tanggalTerbooking.textContent = "";
    }
  });
};

fetchBookedDates();

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nama: form.nama.value,
    email: form.instagram.value, // Ganti field 'email' dengan 'instagram'
    tanggal: form.tanggal.value,
    layanan: form.layanan.value,
    pesan: form.pesan.value
  };

  const res = await fetch("https://script.google.com/macros/s/AKfycbx9MHoGEYKGcebU93XkKD2zmLzPw182X9163BsXOg9pvrKDpNzNsNWnuotyuMVCR3Fk/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    alert("Booking berhasil dikirim!");
    form.reset();
  } else {
    alert("Gagal mengirim booking.");
  }
});

