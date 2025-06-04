const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZVLtsG48-qsg0ZgMBlZvcojoS2j8ZAlMmj06o5omCmMr0hU9lQ2yWuqkVmjbLB5pp/exec";

const uploadInput = document.getElementById("uploadInput");
const previewFoto = document.getElementById("previewFoto");

uploadInput.addEventListener("change", (e) => {
  previewFoto.innerHTML = "";
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
      previewFoto.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

const bookingForm = document.getElementById("bookingForm");
const successMessage = document.getElementById("success");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    nama: bookingForm.nama.value,
    instagram: bookingForm.instagram.value,
    tanggal: bookingForm.tanggal.value,
    jenis: bookingForm.jenis.value,
    catatan: bookingForm.catatan.value,
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      bookingForm.reset();
      successMessage.classList.remove("hidden");
      setTimeout(() => successMessage.classList.add("hidden"), 4000);
    } else {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  } catch (error) {
    alert("Gagal mengirim data. Periksa koneksi Anda.");
    console.error(error);
  }
});

// Init Pikaday & Disable Tanggal Terbooking
let picker;
async function initCalendar() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const bookedDates = await response.json();
    picker = new Pikaday({
      field: document.getElementById("datepicker"),
      format: 'YYYY-MM-DD',
      disableDayFn: function(date) {
        const dateString = date.toISOString().split('T')[0];
        return bookedDates.includes(dateString);
      }
    });
    // Ambil data tanggal dan jam dari Google Sheets
    fetch(GOOGLE_SCRIPT_URL + "?action=getBookings")
      .then(res => res.json())
      .then(data => {
        allBookings = data;
      });

    document.getElementById("datepicker").addEventListener("change", () => {
      const selectedDate = document.getElementById("datepicker").value;
      jamSelect.innerHTML = "<option value=''>Pilih Jam</option>";

      const allJam = [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
      ];

      const bookedJam = allBookings
        .filter(b => b.tanggal === selectedDate)
        .map(b => b.jam);

      allJam.forEach(j => {
        if (!bookedJam.includes(j)) {
          const option = document.createElement("option");
          option.value = j;
          option.textContent = j;
          jamSelect.appendChild(option);
        }
      });
    });
  } catch (error) {
    console.error("Gagal memuat kalender:", error);
  }
}
