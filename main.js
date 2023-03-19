//////////////////////////////// 
//Change background of the shorten link section dynamically
//////////////////////////////// 
    const shortenLinkContainer = document.getElementById("shorten-link-container")
    const boostAreaContainer = document.getElementById("boost-area-container")
    function changeBackground() {
        if (window.innerWidth < 1120) {
            shortenLinkContainer.classList.add(['shorten-link-background-mobile'])
            boostAreaContainer.classList.add(['boost-background-mobile'])
        }
        else {
            shortenLinkContainer.classList.remove(['shorten-link-background-mobile'])
            boostAreaContainer.classList.remove(['boost-background-mobile'])
        }
    }
    changeBackground();
    window.onresize = changeBackground;
////////////////////////////////
////////////////////////////////



//////////////////////////////// 
// Burger menu logic
//////////////////////////////// 
    const burgerMenu = document.getElementById("burger-menu")
    burgerMenu.addEventListener("click", () => {
        console.log('clicked');
        const mainMenu = document.getElementById("main-menu");
        console.log(mainMenu);
        mainMenu.classList.toggle("toggle-display")
    })
////////////////////////////////
////////////////////////////////




////////////////////////////////
// Shrtco api integration
////////////////////////////////
    // Global shortened links
    const shotenedLinks = getFromLocalStorage() || [];
    // Append components from local storage
    appendFromLocalstorage();
    const shortenButton = document.getElementById("shorten-button")
    // Calls shortening link API
    shortenButton.addEventListener("click", async (event) => {
        const linkToShorten = document.getElementById("link-to-shorten").value;
        try {
            const result = await callShortenAPI(linkToShorten);
            // Add new component after shortening
            appendNewLinkComponent(linkToShorten, result.data.result.short_link, result.data.result.code);
            // Store value to local storage
            storeToLocalStorage(linkToShorten, result.data.result.short_link, result.data.result.code);
        }
        catch (err) {
            alert(err)
        }
    })






///////////////// Helper functions /////////////////
        // Store all links to local storage 
        function storeToLocalStorage(link, shortened, code) {
            shotenedLinks.push({link, shortened, code})
            localStorage.setItem('links', JSON.stringify(shotenedLinks))
        }

        // Get all links from local storage 
        function getFromLocalStorage() {
            const links = localStorage.getItem('links');    
            return JSON.parse(links);
        }

        // Append all links from local storage 
        function appendFromLocalstorage(){
            const links = getFromLocalStorage();
            console.log(links);
            if (links) {
                
                for (let el of links) {
                    console.log(el);
                    appendNewLinkComponent(el.link, el.shortened, el.code)
                }
            }
}
        
        // Appends new component for the resulting link
        function appendNewLinkComponent(originalLink, shortenedLink, id) {
            const linksParent = document.getElementById("section-2");
            const linkContainer = document.createElement('div');
            linkContainer.classList.add('shortened-link-container')
            
            // Creates the left part of the component
            const leftLinkEl = document.createElement('div');
            leftLinkEl.classList.add('shortened-left')
            const leftlinkContentEl = document.createElement('p');
            leftlinkContentEl.textContent = originalLink
            leftLinkEl.appendChild(leftlinkContentEl);
            linkContainer.appendChild(leftLinkEl)

            // Creates the rigth part of the component
            const rightLinkEl = document.createElement('div');
            rightLinkEl.classList.add('shortened-right')
            const rightlinkContentParent = document.createElement('div');
            const rightlinkContent = document.createElement('p');
            rightlinkContent.textContent = `https://${shortenedLink}`
            rightlinkContentParent.appendChild(rightlinkContent);
            const rightlinkButtonParent = document.createElement('div');
            const rightlinkButton = document.createElement('button');
            rightlinkButton.id = id
            rightlinkButton.textContent = 'Copy';
            rightlinkButtonParent.appendChild(rightlinkButton)

            rightLinkEl.appendChild(rightlinkContentParent);
            rightLinkEl.appendChild(rightlinkButtonParent);

            // Assemble left and right parts together
            linkContainer.appendChild(rightLinkEl)
            linksParent.appendChild(linkContainer)

            // Adds a copy functionallity to the copy buttons
            addCallBackToCopyButton(id, `https://${shortenedLink}`)
        }

        // Adds call back to all copy buttons
        function addCallBackToCopyButton(id, value) {
            const button = document.getElementById(id);
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(value)
                .then(() => {
                    button.classList.add('copied-link')
                    button.innerText = 'Copied!';
                })
                .catch(() => {
                    Alert('Failed to copy!');
                });
            });
        }

        // Calls shortening links api
        async function callShortenAPI(link) {
            const result = await axios({
                method: 'get',
                baseURL: 'https://api.shrtco.de/v2',
                url:'/shorten',
                params: {
                    url: link
                }
            });
            return result;
        }
////////////////////////////////
////////////////////////////////



////////////////////////////////
// Input validation dynamic styling
////////////////////////////////
    // Counter to know if the input is touched or not
let inputClickCounter = 0;
    
    const inputField = document.getElementById("link-to-shorten")
    const validationError = document.getElementById("validation-error")
    // Counts numbers of clicks on the input
    inputField.addEventListener('click', () => {
        inputClickCounter++;
    })

    // Checks if the input is clicked (toched) and doesn't contain value 
    inputField.addEventListener('focusin', () => {
        if (inputClickCounter > 0 && inputField.value == "") {
        inputField.classList.add('invalid-input')
        }
        else {
            inputField.classList.remove('invalid-input');
        }
    })
    inputField.addEventListener('focusout', () => {
        if (inputClickCounter > 0 && inputField.value == "") {
            inputField.classList.add('invalid-input');
            window.innerWidth > 1120 ?
                validationError.classList.add('toggle-display'): console.log();
        }
        else {
            inputField.classList.remove('invalid-input');
            window.innerWidth > 1120 ?
                validationError.classList.remove('toggle-display'): console.log();
        }
    })
////////////////////////////////
////////////////////////////////


