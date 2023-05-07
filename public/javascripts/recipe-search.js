const nomenclator = document.querySelector('.nomenclator')
const produsLink = nomenclator.querySelectorAll('li')
const searchBar = document.getElementById('cauta');
const icon = document.getElementById('add');
const recipes = document.querySelectorAll('.recipes')
const profile = document.getElementById('profile')

if (icon) {
    icon.addEventListener('click', function () {
        window.location.href = '/recipes/add';
    });
}



produsLink.forEach(function (item) {
    item.addEventListener('click', function () {
        let link = item.querySelector('a');
        window.location = link.href;
    });
});


searchBar.addEventListener('input', function () {
    let searchTerm = this.value.toLowerCase();
    Array.from(produsLink).forEach(function (item) {
        let itemText = item.textContent;
        if (itemText.toLowerCase().indexOf(searchTerm) != -1) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// profile.onclick = () => {
//     console.log('click')
//     showModal()
// }

