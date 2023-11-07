let baseUrlLocal = 'http://localhost:8090/'
let baseUrlHeroku = 'https://www.cafetish.com/'

const entryDate = document.getElementById('entry-date')
const currentDate = new Date().toISOString().split("T")[0];  // Get the current date in ISO format (YYYY-MM-DD)
document.getElementById('entry-date').value = currentDate;  // Set the value of the date input to the current date
document.getElementById("entry-date").setAttribute("max", currentDate);

// Global variables to keep track of the current start date and end date
let startDate;
let endDate;

// Function to create and display the calendar tabs
function createCalendarTabs() {

    const tabsContainer = document.getElementById("dayTab");
    const contentContainer = document.getElementById("dayTabContent");

    // Clear previous tabs and content
    tabsContainer.innerHTML = "";
    contentContainer.innerHTML = "";
    // Loop to create the tabs for the last ten days
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
        // Format the date as desired (e.g., "YYYY-MM-DD")
        const formattedDate = currentDate.toLocaleDateString('ro-RO', { month: 'numeric', day: 'numeric', year: '2-digit' });
        const idDate = formattedDate.replace(/[.\s]/g, "")

        // Create the tab element
        const tab = document.createElement("li");
        tab.className = "nav-item";
        tab.setAttribute('role', 'presentation')

        // Create the tab link
        const button = document.createElement("button");
        button.classList.add("nav-link");
        button.id = idDate
        button.setAttribute('data-bs-toggle', 'tab');
        button.setAttribute('data-bs-target', `#tab-${idDate}`);
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', `${idDate}-tab-pane`);
        button.setAttribute('aria-selected', 'false');
        button.innerHTML = formattedDate

        // Append the link to the tab
        tab.appendChild(button);

        // Append the tab to the tabs container
        tabsContainer.appendChild(tab);

        // Create the tab content
        const tabContent = document.createElement("div");
        tabContent.classList.add('tab-styles', 'tab-pane')
        // tabContent.className = "tab-pane";
        tabContent.id = `tab-${idDate}`;
        tabContent.setAttribute('role', 'tabpanel');
        tabContent.setAttribute('aria-labelledby', `${idDate}-tab`);
        tabContent.setAttribute('tabindex', '0');
        button.addEventListener("click", clickHandler(button, tabContent))

        // Append the tab content to the content container
        contentContainer.appendChild(tabContent);

        currentDate.setDate(currentDate.getDate() + 1)
    }

    // Activate the first tab
    tabsContainer.lastChild.lastChild.classList.add("active");
    contentContainer.lastChild.classList.add("active", "show");
}

function clickHandler(button, wrapper) {
    fetch(`${baseUrlHeroku}register/entry?data=${button.innerText}`).then((res) => res.json().then((data) => {
        console.log(data)
        if (data.regDay === null) {
            const template = document.createElement('div');
            template.classList.add('no-records')
            template.innerText = 'No Records!'
            wrapper.append(template)
        } else {
            createPreviousDayHeader(wrapper, data);
            createHeaderEntry(wrapper, data);
            data.regDay.entry.forEach(function (el) {
                createEntryRow(wrapper, el)
            })
            createDayFooter(wrapper, data)
        }
    }))

    button.removeEventListener('click', clickHandler)
}


function createEntryRow(wrapper, el) {
    const entryWrapper = document.createElement('div')
    const entryDescription = document.createElement('span')
    const entryType = document.createElement('span')
    const entryDocNumber = document.createElement('span')
    const entrySum = document.createElement('span')
    const delEntry = document.createElement('i');
    entryDescription.innerText = el.description
    let entryTypeName;
    el.tip === 'expense' ? entryTypeName = 'Cheltuială' : entryTypeName = 'Încasare';
    entryType.innerText = entryTypeName;
    entryDocNumber.innerText = el.index
    entrySum.innerText = el.amount
    let mark = ''
    if (el.tip === 'expense') {
        mark = 'red-mark'
    } else {
        mark = 'green-mark'
    }
    entryDescription.classList.add('col-5', 'text-center', 'border');
    entryType.classList.add('col-2', 'text-center', 'border', mark);
    entryDocNumber.classList.add('col-1', 'text-center', 'offset-1', 'border');
    entrySum.classList.add('col-2', 'text-center', 'border', mark);
    entryWrapper.classList.add('row', 'entry', 'my-1')
    delEntry.classList.add('col-1', 'bi', 'bi-trash3')
    entryWrapper.append(entryDocNumber, entryDescription, entryType, entrySum, delEntry)
    wrapper.appendChild(entryWrapper)
    delEntry.addEventListener('click', function () {
        fetch(`${baseUrlHeroku}rapoarte/entry`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: el._id })
        }).then((res) => res.json().then((res) => {
            createMessage(wrapper, res.message)
        }))
        updateTotal(el.amount)
        const parentElement = delEntry.parentNode
        parentElement.remove()
    })
}

function updateTotal(entrySum) {
    const totalSumEl = document.querySelector('.total-sum')
    totalSumEl.innerText = parseFloat(totalSumEl.innerText) - entrySum
}

function createMessage(wrapper, message) {
    const messageWrapper = document.createElement('div')
    const messageSucces = document.createElement('span')
    messageSucces.classList.add('col-6', 'offset-3', 'message')
    messageWrapper.classList.add('row', 'text-center', 'message-wrapper')
    messageSucces.innerText = message
    messageWrapper.appendChild(messageSucces)
    wrapper.appendChild(messageWrapper)
    setTimeout(() => {
        messageSucces.classList.add('hide')
    }, 3000)
}

function createHeaderEntry(wrapper, data) {
    const header = document.createElement('div')
    if (data.regDay === null || !data.regDay.entry.length) {
        header.innerText = 'Nu Sunt Înregistrări!'
        header.classList.add('no-records')
    } else {
        const headerNrDoc = document.createElement('span')
        const headerDescription = document.createElement('span')
        const headerType = document.createElement('span')
        const headerSum = document.createElement('span')
        const headerPrevSum = document.createElement('span')
        headerPrevSum.innerHTML = ''
        headerNrDoc.innerText = 'Nr'
        headerDescription.innerText = 'Descriere'
        headerType.innerText = 'Tip de Intrare'
        headerSum.innerText = 'Sumă'
        headerPrevSum.classList.add('col-1')
        header.classList.add('row', 'heder-row')
        headerNrDoc.classList.add('col-1', 'offset-1', 'text-center', 'border')
        headerDescription.classList.add('col-5', 'text-center', 'border')
        headerType.classList.add('col-2', 'text-center', 'border')
        headerSum.classList.add('col-2', 'text-center', 'border')
        header.append(headerNrDoc, headerDescription, headerType, headerSum, headerPrevSum)
    }
    wrapper.appendChild(header)
}

function createPreviousDayHeader(wrapper, el) {
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('row', 'prev-day-header')
    const title = document.createElement('span')
    title.classList.add('col-5', 'offset-4', 'border')
    title.innerText = 'Numerar din ziua precedentă'
    const sum = document.createElement('span')
    sum.classList.add('col-2', 'border')
    sum.innerText = el.regDay.cashIn
    dayHeader.append(title, sum)
    wrapper.appendChild(dayHeader)
}

function createDayFooter(wrapper, el) {
    const footer = document.createElement('div');
    footer.classList.add('row', 'prev-day-footer')
    const title = document.createElement('span');
    title.classList.add('col-5', 'offset-4', 'border');
    title.innerText = 'Total la sfârșit de zi';
    const sum = document.createElement('span');
    sum.classList.add('col-2', 'border', 'total-sum')
    sum.innerText = el.regDay.cashOut
    footer.append(title, sum)
    wrapper.appendChild(footer)
}

// Function to handle the previous button click
function handlePrevButtonClick() {
    endDate.setDate(endDate.getDate() - 4);
    startDate.setDate(startDate.getDate() - 4);
    createCalendarTabs();
}

// Function to handle the next button click
function handleNextButtonClick() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (endDate < today) {
        endDate.setDate(endDate.getDate() + 4);
        startDate.setDate(startDate.getDate() + 4);
        createCalendarTabs();
    }
}

const today = new Date();
today.setHours(0, 0, 0, 0);
startDate = new Date(today);
startDate.setDate(today.getDate() - 8);
endDate = new Date(today);

// Attach event listeners to the buttons
document.getElementById("prevBtn").addEventListener("click", handlePrevButtonClick);
document.getElementById("nextBtn").addEventListener("click", handleNextButtonClick);

// Create the initial calendar tabs
createCalendarTabs();