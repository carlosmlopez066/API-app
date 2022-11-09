
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

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);

        }
    });
});

function moviesIteration(
    movies,
    PrincipalContainer,
    {
        lazyLoad = false,
        clean = true
    } = {},
) {
    if (clean) {
        PrincipalContainer.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
        );

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src',
                'https://www.ensalza.com/blog/wp-content/uploads/error-500.jpg')
        })

        if (lazyLoad) {
            lazyLoader.observe(movieImg)
        }

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
//llamados a la api
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    moviesIteration(movies, trendingMoviesPreviewList, true)


}
async function getMoviesByCategories(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        },
    });
    maxPage = data.total_pages;
    const movies = data.results;
    moviesIteration(movies, genericSection, { lazyLoad: true })
}
function getPaginationMoviesByCategories(id) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15;
        const pageNotMax = page < maxPage;
        if (scrollIsBottom && pageNotMax) {
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
            moviesIteration(
                movies,
                genericSection,
                {
                    lazyLoad: true,
                    clean: false
                });

        }
    }
}
async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    maxPage = data.total_pages;
    console.log(maxPage)

    const movies = data.results;
    moviesIteration(movies, genericSection);
}
function getPaginationMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15;
        const pageNotMax = page < maxPage;
        if (scrollIsBottom && pageNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
            moviesIteration(
                movies,
                genericSection,
                {
                    lazyLoad: true,
                    clean: false
                });

        }
    }
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    categoriesIteration(categories, categoriesPreviewList);
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    moviesIteration(movies, genericSection, { lazyLoad: true, clean: true });

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'load more';
    // btnLoadMore.addEventListener('click', getPaginationTrendingMovies)
    // genericSection.appendChild(btnLoadMore)

}

// let page = 1;
// window.addEventListener('scroll', getPaginationTrendingMovies);
async function getPaginationTrendingMovies() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15;
    const pageNotMax = page < maxPage;
    if (scrollIsBottom && pageNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            }
        });
        const movies = data.results;

        moviesIteration(
            movies,
            genericSection,
            {
                lazyLoad: true,
                clean: false
            });
        // const btnLoadMore = document.createElement('button');
        // btnLoadMore.innerText = 'load more';
        // btnLoadMore.addEventListener('click', getPaginationTrendingMovies)
        // genericSection.appendChild(btnLoadMore)

    }
}
async function getMoviebyId(idMovie) {
    const { data: movie } = await api(`movie/${idMovie}`);
    const moviePoster = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
            ),
        url(${moviePoster})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    categoriesIteration(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesID(idMovie);
}

async function getRelatedMoviesID(idMovie) {
    const { data } = await api(`movie/${idMovie}/recommendations`);
    const relatedMovies = data.results;

    moviesIteration(relatedMovies, relatedMoviesContainer, true);
}

