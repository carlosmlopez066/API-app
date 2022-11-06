
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': '2afd85bcb3aa680c60b1e37e32a5fee2'
    }

});
const api_key = '2afd85bcb3aa680c60b1e37e32a5fee2';

//helpers
function moviesIteration(movies, PrincipalContainer) {
    PrincipalContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src',
            `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
        );
        movieContainer.appendChild(movieImg);
        PrincipalContainer.appendChild(movieContainer)
    });
}

function categoriesIteration(categories, container) {
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => [
            location.hash = `#category=${category.id}-${category.name}`
        ])
        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    });
}
//
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    moviesIteration(movies, trendingMoviesPreviewList)


}
async function getMoviesByCategories(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        },
    });
    const movies = data.results;
    moviesIteration(movies, genericSection)
}
async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    moviesIteration(movies, genericSection);
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    categoriesIteration(categories, categoriesPreviewList);
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    moviesIteration(movies, genericSection)


}

