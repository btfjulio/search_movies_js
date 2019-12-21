const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSource = movie.Poster === 'N/A' ? '' : movie.Poster;  
        return `
        <img src=${imgSource} />
        ${movie.Title}
    `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    fetchData: async (searchTerm) => {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'e26b13d7',
                s: searchTerm
            }
        });

        if (response.data.Error) {
            return [];
        };
        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }   
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }    
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'e26b13d7',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparsion();
    }
}


const runComparsion = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        
        if (rightSideValue > leftSideValue) {
            leftStat.classList.add('is-warning');
            leftStat.classList.remove('is-primary');
        } else {
            rightStat.classList.add('is-warning');
            rightStat.classList.remove('is-primary');
        }
    })
}



const movieTemplate = (movieDetails) => {
    const dollars = parseInt(
        movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    );
    const metaScore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    
    let count = 0;
    const awards = movieDetails.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value
        }
    }, 0);
    
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>   
        <article data-value= ${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value= ${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value= ${metaScore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Meta Score</p>
        </article>
        <article data-value= ${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">imdb Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">imdb Votes</p>
        </article>
                 
    `;  
}