// Función para hacer la solicitud a la API de películas
const fetchMovies = async () => {
  try {
    const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Función para crear estrellas según el promedio de votos
const createStars = (voteAverage) => {
  const maxStars = 5;
  let stars = '';
  const filledStars = Math.round((voteAverage / 10) * maxStars);
  
  for (let i = 0; i < maxStars; i++) {
    if (i < filledStars) {
      stars += '<span class="fa fa-star checked"></span>'; 
    } else {
      stars += '<span class="fa fa-star"></span>'; 
    }
  }
  return stars;
};

// Función para mostrar los resultados de búsqueda
const showMovies = (movies, query) => {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; 

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
movie.genres.some(genre => typeof genre === 'string' && genre.toLowerCase().includes(query.toLowerCase())) ||
    movie.tagline.toLowerCase().includes(query.toLowerCase()) ||
    movie.overview.toLowerCase().includes(query.toLowerCase())
  );

  filteredMovies.forEach(movie => {
    const stars = createStars(movie.vote_average);
    
    const movieItem = `
      <li class="list-group-item bg-dark text-light mb-2" data-id="${movie.id}">
        <h5>${movie.title}</h5>
        <p>${movie.tagline}</p>
        <div>Rating: ${stars}</div>
        <button class="btn btn-primary mt-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">Ver más</button>
      </li>
    `;

    lista.innerHTML += movieItem;
  });

  // Event listeners para los botones "Ver más"
  const movieItems = document.querySelectorAll('.list-group-item button');
  movieItems.forEach(button => {
    button.addEventListener('click', (e) => {
      const movieId = e.target.parentElement.getAttribute('data-id');
      const selectedMovie = movies.find(movie => movie.id == movieId);
      showMovieDetails(selectedMovie);
    });
  });
};

// Función para mostrar detalles de la película
const showMovieDetails = (movie) => {
  const offcanvasTitle = document.getElementById('offcanvasTopLabel');
  const offcanvasBody = document.getElementById('offcanvasBody');
  
  // Actualizar el contenido principal del offcanvas
  offcanvasTitle.innerHTML = movie.title;
  document.getElementById('overview').innerHTML = movie.overview;
  document.getElementById('generos').innerHTML = `<strong>Géneros:</strong> ${movie.genres.join(', ')}`;
  
  // Actualizar los detalles adicionales
  document.getElementById('releaseYear').innerHTML = new Date(movie.release_date).getFullYear();
  document.getElementById('duration').innerHTML = movie.runtime;
  document.getElementById('budget').innerHTML = movie.budget.toLocaleString();
  document.getElementById('revenue').innerHTML = movie.revenue.toLocaleString();
};

// Agregar evento al botón de búsqueda
document.getElementById('btnBuscar').addEventListener('click', async () => {
  const inputBuscar = document.getElementById('inputBuscar').value.trim();
  if (inputBuscar !== '') {
    const movies = await fetchMovies();
    showMovies(movies, inputBuscar);
  }
});
