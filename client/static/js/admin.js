"use strict";

function checkSession() {
    try {
        const user = JSON.parse(localStorage.getItem("vash-promouter-session-v1"));
        return user?.role === "admin";
    } catch {
        return false;
    }
}

window.addEventListener("pageshow", () => {
    if (!checkSession()) location.replace("login.html");
});

if (!checkSession()) {
    location.replace("login.html");
} else {
    document.querySelector("#protected-shell").hidden = false;
    startAdmin();
}

function startAdmin() {
    const escapeHtml = (value) =>
        String(value).replace(
            /[&<>"']/g,
            (c) =>
                ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
                    c
                ],
        );
    const money = (value) => new Intl.NumberFormat("ru-RU").format(value) + " \u20bd";
    const dateLabel = (value) =>
        new Date(value + "T12:00:00").toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
        });
    const relativeDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const statuses = {
        new: "\u041d\u043e\u0432\u0430\u044f",
        work: "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435",
        done: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430",
        cancel: "\u041e\u0442\u043c\u0435\u043d\u0435\u043d\u0430",
    };
    const seed = [
        {
            id: 1048,
            title: "\u041e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u0430",
            client: "\u0417\u043e\u043b\u043e\u0442\u043e\u0435 \u044f\u0431\u043b\u043e\u043a\u043e",
            date: relativeDate(1),
            budget: 45000,
            status: "work",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0422\u0426 \u00ab\u0410\u0432\u0438\u0430\u043f\u0430\u0440\u043a\u00bb",
            type: "\u041f\u0440\u043e\u043c\u043e\u0430\u043a\u0446\u0438\u044f",
        },
        {
            id: 1047,
            title: "\u0414\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u044f \u043d\u043e\u0432\u043e\u0439 \u043b\u0438\u043d\u0435\u0439\u043a\u0438",
            client: "\u0412\u043a\u0443\u0441\u0412\u0438\u043b\u043b",
            date: relativeDate(2),
            budget: 32000,
            status: "new",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0443\u043b. \u041b\u0435\u0441\u043d\u0430\u044f, 7",
            type: "\u0414\u0435\u0433\u0443\u0441\u0442\u0430\u0446\u0438\u044f",
        },
        {
            id: 1046,
            title: "\u041b\u0438\u0441\u0442\u043e\u0432\u043a\u0438 \u0443 \u043c\u0435\u0442\u0440\u043e",
            client: "\u0421\u0430\u043c\u043e\u043a\u0430\u0442",
            date: relativeDate(3),
            budget: 18500,
            status: "work",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u043c. \u0411\u0435\u043b\u043e\u0440\u0443\u0441\u0441\u043a\u0430\u044f",
            type: "\u0420\u0430\u0437\u0434\u0430\u0447\u0430 \u043b\u0438\u0441\u0442\u043e\u0432\u043e\u043a",
        },
        {
            id: 1045,
            title: "\u041e\u0441\u0435\u043d\u043d\u0438\u0439 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043b\u044c",
            client: "\u042f\u043d\u0434\u0435\u043a\u0441",
            date: relativeDate(5),
            budget: 120000,
            status: "new",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0425\u043b\u0435\u0431\u043e\u0437\u0430\u0432\u043e\u0434 \u2116 9",
            type: "\u041c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u0435",
        },
        {
            id: 1044,
            title: "\u041f\u0440\u043e\u043c\u043e \u0432 \u0442\u043e\u0440\u0433\u043e\u0432\u043e\u043c \u0446\u0435\u043d\u0442\u0440\u0435",
            client: "\u041b\u042d\u0422\u0423\u0410\u041b\u042c",
            date: relativeDate(6),
            budget: 28000,
            status: "work",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0422\u0426 \u00ab\u041c\u0435\u0442\u0440\u043e\u043f\u043e\u043b\u0438\u0441\u00bb",
            type: "\u041f\u0440\u043e\u043c\u043e\u0430\u043a\u0446\u0438\u044f",
        },
        {
            id: 1043,
            title: "\u041f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u043a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u0438",
            client: "LIME",
            date: relativeDate(7),
            budget: 64000,
            status: "new",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0443\u043d\u0438\u0432\u0435\u0440\u043c\u0430\u0433 \u00ab\u0426\u0432\u0435\u0442\u043d\u043e\u0439\u00bb",
            type: "\u041f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f",
        },
        {
            id: 1042,
            title: "\u041e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 \u043a\u043e\u0444\u0435\u0439\u043d\u0438",
            client: "Surf Coffee",
            date: relativeDate(-2),
            budget: 24000,
            status: "done",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0443\u043b. \u041f\u043e\u043a\u0440\u043e\u0432\u043a\u0430, 12",
            type: "\u041f\u0440\u043e\u043c\u043e\u0430\u043a\u0446\u0438\u044f",
        },
        {
            id: 1041,
            title: "\u041f\u0440\u043e\u043c\u043e \u0432\u044b\u0445\u043e\u0434\u043d\u043e\u0433\u043e \u0434\u043d\u044f",
            client: "\u0421\u043f\u043e\u0440\u0442\u043c\u0430\u0441\u0442\u0435\u0440",
            date: relativeDate(-4),
            budget: 36000,
            status: "cancel",
            address: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0422\u0426 \u00ab\u0415\u0432\u0440\u043e\u043f\u0435\u0439\u0441\u043a\u0438\u0439\u00bb",
            type: "\u041f\u0440\u043e\u043c\u043e\u0430\u043a\u0446\u0438\u044f",
        },
    ];
    const storageKey = "vash-promouter-demo-v1";
    let requests = structuredClone(seed);
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (
            Array.isArray(saved) &&
            saved.every(
                (r) =>
                    r &&
                    Number.isFinite(r.id) &&
                    typeof r.title === "string" &&
                    typeof r.client === "string" &&
                    typeof r.address === "string" &&
                    typeof r.type === "string" &&
                    /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
                    !Number.isNaN(Date.parse(r.date)) &&
                    Number.isFinite(r.budget) &&
                    r.budget >= 0 &&
                    Object.hasOwn(statuses, r.status),
            )
        )
            requests = saved;
    } catch {
        
    }
    let editingId = null;
    let page = "requests",
        activeFilter = "all",
        query = "",
        sort = "date",
        toastTimer;
    const pages = {
        requests: [
            "\u0417\u0430\u044f\u0432\u043a\u0438",
            "\u041e\u0442 \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0430 \u0434\u043e \u0443\u0441\u043f\u0435\u0448\u043d\u043e\u0433\u043e \u043c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f.",
            "\u0412\u0441\u0435 \u0437\u0430\u044f\u0432\u043a\u0438",
            "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0430\u043c\u0438 \u0432 \u043e\u0434\u043d\u043e\u043c \u043c\u0435\u0441\u0442\u0435",
        ],
        clients: [
            "\u041a\u043b\u0438\u0435\u043d\u0442\u044b",
            "\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u0438, \u0441 \u043a\u043e\u0442\u043e\u0440\u044b\u043c\u0438 \u043c\u044b \u0441\u043e\u0437\u0434\u0430\u0451\u043c \u0441\u043e\u0431\u044b\u0442\u0438\u044f.",
            "\u0412\u0441\u0435 \u043a\u043b\u0438\u0435\u043d\u0442\u044b",
            "\u041a\u043b\u0438\u0435\u043d\u0442\u044b \u0438\u0437 \u0432\u0430\u0448\u0438\u0445 \u0437\u0430\u044f\u0432\u043e\u043a",
        ],
        history: [
            "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0437\u0430\u043a\u0430\u0437\u043e\u0432",
            "\u041f\u0440\u043e\u0435\u043a\u0442\u044b, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043c\u044b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043b\u0438.",
            "\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043d\u043d\u044b\u0435 \u0437\u0430\u043a\u0430\u0437\u044b",
            "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0440\u0430\u0431\u043e\u0442\u044b \u0432\u0430\u0448\u0435\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
        ],
        canceled: [
            "\u041e\u0442\u043c\u0435\u043d\u0451\u043d\u043d\u044b\u0435 \u0437\u0430\u044f\u0432\u043a\u0438",
            "\u041e\u0442\u043c\u0435\u043d\u0451\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u0438.",
            "\u041e\u0442\u043c\u0435\u043d\u0451\u043d\u043d\u044b\u0435 \u0437\u0430\u043a\u0430\u0437\u044b",
            "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443, \u0447\u0442\u043e\u0431\u044b \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0435\u0451 \u0441\u0442\u0430\u0442\u0443\u0441",
        ],
    };
    function notify(message) {
        document.querySelector("#toast").textContent = message;
        document.querySelector("#toast").classList.add("visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => document.querySelector("#toast").classList.remove("visible"), 3200);
    }

    function save() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(requests));
            return true;
        } catch {
            notify(
                "\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u0434\u043e \u0437\u0430\u043a\u0440\u044b\u0442\u0438\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b: \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e.",
            );
            return false;
        }
    }
    function badge(status) {
        return `<span class="badge badge-${status}">${statuses[status]}</span>`;
    }
    function stats() {
        const count = (s) => requests.filter((r) => r.status === s).length;
        const data = [
            ["\u0412\u0441\u0435\u0433\u043e \u0437\u0430\u044f\u0432\u043e\u043a", requests.length, "\u0412\u0441\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0430", "\u25a6"],
            ["\u0412 \u0440\u0430\u0431\u043e\u0442\u0435", count("work"), "\u041a\u043e\u043c\u0430\u043d\u0434\u044b \u0443\u0436\u0435 \u043d\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u0430\u0445", "\u25f7"],
            ["\u041d\u043e\u0432\u044b\u0435 \u0437\u0430\u044f\u0432\u043a\u0438", count("new"), "\u041e\u0436\u0438\u0434\u0430\u044e\u0442 \u043d\u0430\u0447\u0430\u043b\u0430 \u0440\u0430\u0431\u043e\u0442\u044b", "\u2197"],
            ["\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e", count("done"), "\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u0441\u043e\u0441\u0442\u043e\u044f\u043b\u0438\u0441\u044c", "\u2713"],
        ];
        document.querySelector("#stats").innerHTML = data
            .map(
                ([label, value, caption, icon]) =>
                    `<article class="stat-card"><div class="stat-top">${label}<span class="stat-icon" aria-hidden="true">${icon}</span></div><p class="stat-value">${value.toString().padStart(2, "0")}</p><p class="stat-caption">${caption}</p></article>`,
            )
            .join("");
        document.querySelector("#nav-count").textContent = requests.length;
    }
    function getRequests() {
        return requests
            .filter(
                (r) =>
                    (page !== "history" || r.status === "done") &&
                    (page !== "canceled" || r.status === "cancel") &&
                    (page !== "requests" ||
                        activeFilter === "all" ||
                        r.status === activeFilter),
            )
            .filter((r) =>
                `${r.title} ${r.client} ${r.id}`.toLowerCase().includes(query),
            )
            .sort((a, b) =>
                sort === "name"
                    ? a.title.localeCompare(b.title, "ru")
                    : a.date.localeCompare(b.date),
            );
    }
    function clients() {
        return [...new Set(requests.map((r) => r.client))]
            .map((name) => ({
                name,
                orders: requests.filter((r) => r.client === name),
            }))
            .filter((c) => c.name.toLowerCase().includes(query))
            .sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }
    function table(headers, rows) {
        return `<table><thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
    }
    function render() {
        stats();
        const meta = pages[page];
        document.querySelector("#page-title").textContent = meta[0];
        document.querySelector("#crumb").textContent = meta[0];
        document.querySelector("#list-title").innerHTML =
            `${meta[2]} <span id="total-count" class="count-pill"></span>`;
        document.querySelector("#page-description").textContent = meta[1];
        document.querySelector("#list-description").textContent = meta[3];
        document.title = `\u0412\u0430\u0448\u041f\u0440\u043e\u043c\u043e\u0443\u0442\u0435\u0440 \u2014 ${meta[0]}`;
        document.querySelectorAll("[data-page]").forEach((a) => {
            a.classList.toggle("active", a.dataset.page === page);
            if (a.dataset.page === page) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
        document.querySelector("#tabs").hidden = page !== "requests";
        document.querySelector("#sort").hidden = !["requests", "history", "canceled"].includes(page);
        document.querySelector("#search").placeholder =
            page === "clients"
                ? "\u041d\u0430\u0439\u0442\u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u0430\u2026"
                : "\u041d\u0430\u0439\u0442\u0438 \u0437\u0430\u044f\u0432\u043a\u0443 \u0438\u043b\u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u0430\u2026";
        document.querySelector("#tabs").innerHTML = [
            ["all", "\u0412\u0441\u0435 \u0437\u0430\u044f\u0432\u043a\u0438"],
            ["new", "\u041d\u043e\u0432\u044b\u0435"],
            ["work", "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435"],
            ["done", "\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043d\u043d\u044b\u0435"],
        ]
            .map(
                ([key, label]) =>
                    `<button class="tab ${activeFilter === key ? "active" : ""}" data-filter="${key}" aria-pressed="${activeFilter === key}">${label}<span>${key === "all" ? requests.length : requests.filter((r) => r.status === key).length}</span></button>`,
            )
            .join("");
        let html = "",
            count = 0;
        if (["requests", "history", "canceled"].includes(page)) {
            const rows = getRequests();
            count = rows.length;
            html = table(
                ["\u041f\u0440\u043e\u0435\u043a\u0442 / \u043a\u043b\u0438\u0435\u043d\u0442", "\u0414\u0430\u0442\u0430", "\u0421\u0442\u0430\u0442\u0443\u0441", "\u0411\u044e\u0434\u0436\u0435\u0442"],
                rows.map(
                    (r, i) =>
                        `<tr><td><div class="project-cell"><span class="project-icon tone-${i % 4}" aria-hidden="true">${["\u25a7", "\u25c8", "\u25a4", "\u2733"][i % 4]}</span><div><button class="project-link" data-detail="${r.id}">${escapeHtml(r.title)}</button><span class="project-sub">#${r.id} \u00b7 ${escapeHtml(r.client)}</span><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px"><button type="button" class="button secondary" style="padding:6px 10px;font-size:12px" data-edit="${r.id}">\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c</button><button type="button" class="button secondary" style="padding:6px 10px;font-size:12px" data-detail="${r.id}">\u0421\u0442\u0430\u0442\u0443\u0441</button><button type="button" class="button secondary" style="padding:6px 10px;font-size:12px;color:#b42318;border-color:#f3b4ae" data-delete="${r.id}">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button></div></div></div></td><td><time datetime="${r.date}">${dateLabel(r.date)}</time></td><td>${badge(r.status)}</td><td class="budget">${money(r.budget)}</td></tr>`,
                ),
            );
        } else if (page === "clients") {
            const rows = clients();
            count = rows.length;
            html = table(
                ["\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f", "\u0417\u0430\u044f\u0432\u043e\u043a", "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435", "\u0411\u044e\u0434\u0436\u0435\u0442 \u0437\u0430\u044f\u0432\u043e\u043a"],
                rows.map(
                    (c) =>
                        `<tr><td><strong>${escapeHtml(c.name)}</strong></td><td>${c.orders.length}</td><td>${c.orders.filter((r) => r.status === "work").length}</td><td class="budget">${money(c.orders.reduce((n, r) => n + r.budget, 0))}</td></tr>`,
                ),
            );
        }
        document.querySelector("#data-view").innerHTML = count
            ? html
            : '<div class="empty"><strong>\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u043a\u0430 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435\u0442</strong>\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u0438\u043b\u0438 \u0434\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043d\u043e\u0432\u0443\u044e \u0437\u0430\u044f\u0432\u043a\u0443.</div>';
        document.querySelector("#total-count").textContent = count;
        document.querySelector("#result-count").textContent = `\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u043e \u0437\u0430\u043f\u0438\u0441\u0435\u0439: ${count}`;

    }
    function openDetail(id) {
        const r = requests.find((r) => r.id === id);
        if (!r) return;
        document.querySelector("#detail-content").innerHTML =
            [
                ["\u041f\u0440\u043e\u0435\u043a\u0442", r.title],
                ["\u041a\u043b\u0438\u0435\u043d\u0442", r.client],
                ["\u0414\u0430\u0442\u0430", dateLabel(r.date)],
                ["\u0410\u0434\u0440\u0435\u0441", r.address],
                ["\u0411\u044e\u0434\u0436\u0435\u0442", money(r.budget)],
            ]
                .map(
                    ([label, value]) =>
                        `<div class="detail-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`,
                )
                .join("") +
            `<label class="detail-row" for="status-select">\u0421\u0442\u0430\u0442\u0443\u0441<select id="status-select" data-id="${r.id}">${Object.entries(
                statuses,
            )
                .map(
                    ([key, label]) =>
                        `<option value="${key}" ${r.status === key ? "selected" : ""}>${label}</option>`,
                )
                .join(
                    "",
                )}</select></label><p class="muted" style="margin-top:16px">\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u0442\u0441\u044f \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u0432 \u044d\u0442\u043e\u043c \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.</p>`;
        document.querySelector("#detail-dialog").showModal();
    }
    function openRequest(id = null) {
        const form = document.querySelector("#request-form");
        const r = requests.find((r) => r.id === id);
        if (id !== null && !r) return;
        editingId = id;
        form.reset();
        form.elements.date.value = relativeDate(1);
        if (r) ["title", "client", "address", "date", "budget"].forEach((key) => form.elements[key].value = r[key]);
        form.querySelector("h2").textContent = r ? "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443" : "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443";
        form.querySelector(".eyebrow").textContent = r ? "\u0420\u0415\u0414\u0410\u041a\u0422\u0418\u0420\u041e\u0412\u0410\u041d\u0418\u0415" : "\u041d\u041e\u0412\u042b\u0419 \u041f\u0420\u041e\u0415\u041a\u0422";
        form.querySelector('[type="submit"]').textContent = r ? "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c" : "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443";
        document.querySelector("#request-dialog").showModal();
    }
    function route() {
        page = Object.hasOwn(pages, location.hash.slice(1))
            ? location.hash.slice(1)
            : "requests";
        activeFilter = "all";
        query = "";
        document.querySelector("#search").value = "";
        render();
    }
    window.addEventListener("hashchange", route);
    document.querySelector("#tabs").addEventListener("click", (e) => {
        const tab = e.target.closest("[data-filter]");
        if (tab) {
            activeFilter = tab.dataset.filter;
            render();
        }
    });
    document.querySelector("#search").addEventListener("input", (e) => {
        query = e.target.value.trim().toLowerCase();
        render();
    });
    document.querySelector("#sort").addEventListener("change", (e) => {
        sort = e.target.value;
        render();
    });
    document.querySelector("#data-view").addEventListener("click", (e) => {
        const button = e.target.closest("[data-detail]");
        if (button) openDetail(Number(button.dataset.detail));
        const edit = e.target.closest("[data-edit]");
        if (edit) openRequest(Number(edit.dataset.edit));
        const remove = e.target.closest("[data-delete]");
        if (remove && confirm("\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443? \u042d\u0442\u043e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043d\u0435\u043b\u044c\u0437\u044f \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c.")) {
            requests = requests.filter((r) => r.id !== Number(remove.dataset.delete));
            const persisted = save();
            render();
            if (persisted) notify("\u0417\u0430\u044f\u0432\u043a\u0430 \u0443\u0434\u0430\u043b\u0435\u043d\u0430");
        }
    });
    document.querySelector("#new-request").addEventListener("click", () => {
        openRequest();
    });
    document
        .querySelectorAll("[data-close]")
        .forEach((button) =>
            button.addEventListener("click", () => button.closest("dialog").close()),
        );
    document.querySelector("#request-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const title = data.get("title").trim(),
            client = data.get("client").trim(),
            address = data.get("address").trim();
        if (!title || !client || !address) {
            notify("\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435, \u043a\u043b\u0438\u0435\u043d\u0442\u0430 \u0438 \u0430\u0434\u0440\u0435\u0441.");
            return;
        }
        const budget = Number(data.get("budget"));
        const date = data.get("date");
        if (!Number.isInteger(budget) || budget < 0 || budget > 999999999 ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
            notify("\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0434\u0430\u0442\u0443 \u0438 \u0431\u044e\u0434\u0436\u0435\u0442.");
            return;
        }
        const existing = requests.find((r) => r.id === editingId);
        if (editingId !== null && !existing) {
            notify("\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430.");
            return;
        }
        const r = {
            id: existing ? existing.id : Math.max(1040, ...requests.map((r) => r.id)) + 1,
            title,
            client,
            address,
            date: data.get("date"),
            budget: Number(data.get("budget")),
            status: existing ? existing.status : "new",
            type: existing ? existing.type : "\u041f\u0440\u043e\u043c\u043e\u0430\u043a\u0446\u0438\u044f",
        };
        if (existing) Object.assign(existing, r);
        else requests.unshift(r);
        const persisted = save();
        document.querySelector("#request-dialog").close();
        page = "requests";
        activeFilter = "all";
        query = "";
        document.querySelector("#search").value = "";
        if (location.hash !== "#requests") {
            location.hash = "requests";
        }
        render();
        if (persisted) notify(existing ? "\u0417\u0430\u044f\u0432\u043a\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0430" : "\u0417\u0430\u044f\u0432\u043a\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0430");
    });
    document.querySelector("#detail-content").addEventListener("change", (e) => {
        if (e.target.id !== "status-select") return;
        const r = requests.find((r) => r.id === Number(e.target.dataset.id));
        r.status = e.target.value;
        const persisted = save();
        render();
        if (persisted) notify("\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u044f\u0432\u043a\u0438 \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d");
    });
    document.querySelector("#export-button").addEventListener("click", () => {
        let rows;
        if (page === "clients")
            rows = [
                ["\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f", "\u0417\u0430\u044f\u0432\u043e\u043a", "\u0411\u044e\u0434\u0436\u0435\u0442"],
                ...clients().map((c) => [
                    c.name,
                    c.orders.length,
                    c.orders.reduce((n, r) => n + r.budget, 0),
                ]),
            ];
        else
            rows = [
                ["\u041d\u043e\u043c\u0435\u0440", "\u041f\u0440\u043e\u0435\u043a\u0442", "\u041a\u043b\u0438\u0435\u043d\u0442", "\u0414\u0430\u0442\u0430", "\u0421\u0442\u0430\u0442\u0443\u0441", "\u0411\u044e\u0434\u0436\u0435\u0442", "\u0410\u0434\u0440\u0435\u0441"],
                ...getRequests().map((r) => [
                    r.id,
                    r.title,
                    r.client,
                    r.date,
                    statuses[r.status],
                    r.budget,
                    r.address,
                ]),
            ];
        const csv =
            "\uFEFF" +
            rows
                .map((row) =>
                    row
                        .map((value) => {
                            let s = String(value);
                            if (/^[=+@\-\t\r\n]/.test(s)) s = "'" + s;
                            return '"' + s.replace(/"/g, '""') + '"';
                        })
                        .join(";"),
                )
                .join("\r\n");
        const url = URL.createObjectURL(
            new Blob([csv], { type: "text/csv;charset=utf-8" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `vash-promouter-${page}.csv`;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        notify("CSV \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d \u0434\u043b\u044f \u0441\u043a\u0430\u0447\u0438\u0432\u0430\u043d\u0438\u044f");
    });
    document.querySelector("#logout-button").addEventListener("click", () => {
        localStorage.removeItem("vash-promouter-session-v1");
        location.replace("login.html");
    });
    route();
}