function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

window.onload = async () => {
  const movieId = getQueryParams();
  await fetchMovieDetails(movieId);
};

async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `https://movie-details-data.onrender.com/movie/${movieId}`
    );
    const movie = await response.json();

    // Object.entries(movie.shows).flatMap(([date,showtime]) => {
    //     console.log(date),
    //     showtime.map((show) => {
    //         console.log(show)
    //     })
    // })
    if (response.ok) {
      const movieDetailsContainer = document.getElementById("movieDetails");
      movieDetailsContainer.innerHTML = `<div style="color: #fff; padding: 0px">
          <div class="container">
            <div class="row">
              <div class="col-md-4">
                <img
                  src="${movie.image}"
                  alt=""
                  class="img-fluid mb-4"
                  style="max-width: 100%; height: 100%; object-fit: cover"
                />
              </div>
              <div class="col-md-8">
                <div style="color: black; padding: 0px">
                  <h1 class="mb-4">${movie.title}</h1>
                  <h4 class="mb-4">Director : ${movie.director}</h4>
                  <h4 class="mb-4">Genre : ${movie.genre}</h4>
                  <h2>About the movie</h2>
                  <p>${movie.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr style="margin-top: 50px" />
      <h2 class="mt-4 mb-4 text-center">Book Tickets</h2>`;

      const showContainer = document.createElement("div");

      showContainer.innerHTML = `
                <div class="container mt-4">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Showtime</th>
                                    <th>Seats</th>
                                    <th>Book Tickets</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(movie.shows)
                                  .flatMap(([date, showtimes]) =>
                                    showtimes.map(
                                      (show, index) => `
                                    <tr>
                                        ${
                                          index === 0
                                            ? `<td rowSpan="${showtimes.length}" class="align-middle"><strong>${date}</strong></td>`
                                            : ""
                                        }
                                        <td>
                                            <div class="border p-1" style="display: flex; flex-direction: column; align-items: center;">
                                                <div>${show.time}</div>
                                                <div class="text-muted" style="font-size: 15px;">4K Dolby Atmos 7.1</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="border p-3" style="display: flex; flex-direction: column; align-items: center;">
                                                <div>${show.seats}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <!-- Button to book tickets -->
                                            <button class="btn btn-sm btn-danger p-3 d-block w-100" onclick="bookTickets('${
                                              movie._id
                                            }', '${
                                        show.id
                                      }', '${date}')">Book Tickets</button>
                                        </td>
                                    </tr>`
                                    )
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
      document.body.appendChild(showContainer);
    }
  } catch (error) {}
}

document.getElementById("submitBooking").addEventListener("click", async () => {
  const movieId = document.getElementById("modalMovieId").value;
  const showId = document.getElementById("modalShowId").value;
  const seats = document.getElementById("modalShowDate").value;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  try {
    const response = await fetch(
      "https://movie-details-data.onrender.com/movie/book-movie",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          showId,
          seats,
          name,
          email,
          phoneNumber,
        }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      const bookingModal = bootstrap.Modal.getInstance(
        document.getElementById("bookingModal")
      );
      bookingModal.hide();
      alert("Tickets booked successfully!");
      window.location.reload();
    }
  } catch (error) {}
});

function bookTickets(movieId, showId, date) {
  // Set the values of modal input fields
  document.getElementById("modalMovieId").value = movieId;
  document.getElementById("modalShowId").value = showId;
  document.getElementById("modalShowDate").value = date;

  // Show the booking modal (using Bootstrap modal)
  const bookingModal = new bootstrap.Modal(
    document.getElementById("bookingModal")
  );
  bookingModal.show();
}
