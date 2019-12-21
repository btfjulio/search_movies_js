//helper debounce function, to limit how often a function can be invoked 
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearInterval(timeoutId);
        }
        // timeoutId represents the timer that returns from the function
        timeoutId = setTimeout(() =>    {
            func.apply(null, args);
        }, delay);
    }
}

