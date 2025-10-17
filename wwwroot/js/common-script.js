// Push from CS file
let menuData = { children: [] };

function sanitizeId(label) {
    return label.replace(/\W+/g, '_');
}

async function loadMenuData() {
    try {
        var t = new Date().getTime();
        let response = await fetch(`/js/menu-config.json?${t}`);
        menuData = await response.json();
    } catch (error) {
        console.error("Error loading menu config:", error);
    }
}

function createMenu(data, lebel) {
    const ul = document.createElement('ul');
    if (lebel == 0) {
        ul.classList.add('navbar-nav');
    }

    data.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('nav-item');

        const a = document.createElement('a');
        if (lebel == 0) {
            a.classList.add('nav-link', 'text-white');
        } else {
            a.classList.add('dropdown-item');
        }
        a.textContent = item.Label;

        if (!item.Children || item.Children.length === 0) {
            a.href = item.PageLink;
        } else {
            a.href = "javascript:void(0)";
        }

        li.appendChild(a);

        const sanitizedLabel = sanitizeId(item.Label);
        if (item.Children && item.Children.length > 0) {
            li.classList.add('dropdown');
            a.classList.add('dropdown-toggle');
            a.setAttribute('data-bs-toggle', 'dropdown');
            a.setAttribute('data-toggle', 'dropdown');
            a.setAttribute('role', 'button');
            a.setAttribute('id', `mainMenu-${sanitizedLabel}`);
            a.setAttribute('aria-haspopup', 'true');
            a.setAttribute('aria-expanded', 'false');

            const childUl = createMenu(item.Children, lebel + 1);
            childUl.setAttribute('aria-labelledby', `mainMenu-${sanitizedLabel}`);
            childUl.classList.add('dropdown-menu');
            li.appendChild(childUl);
        }

        ul.appendChild(li);
    });

    return ul;
}

async function showLoggedInUserInfo() {
    let infoContainer = document.getElementById('logged-in-user-info');
    /*
        TODO: implement code to fetch and show authentication details.
        render logged in user info with logout option.
        Show login and registration option for anonymous users.
    */
}

setTimeout(async () => {
    await showLoggedInUserInfo();
    await loadMenuData();
    let navContainer = document.getElementById('navbarNav');
    navContainer.appendChild(createMenu(menuData.Children, 0));
    setTimeout(() => {
        $('.dropdown-toggle').dropdown();
    }, 100);
}, 100);