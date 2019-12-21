const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input type="text" class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    let timeoutId;
    const onInput = async event => {
        resultsWrapper.innerHTML = "";
        const items = await fetchData(event.target.value);
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item); 
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        }
    }
    // debounce is being called to prevent that fetchData to be called more than once for a delay in miliseconds
    input.addEventListener('input', debounce(onInput, 1000));

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active')
        }
    })
};