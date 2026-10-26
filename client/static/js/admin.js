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
    const money = (value) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
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
        new: "Новая",
        work: "В работе",
        done: "Завершена",
        cancel: "Отменена",
    };
    const seed = [
        {
            id: 1048,
            title: "Открытие магазина",
            client: "Золотое яблоко",
            date: relativeDate(1),
            budget: 45000,
            status: "work",
            address: "Москва, ТЦ «Авиапарк»",
            type: "Промоакция",
        },
        {
            id: 1047,
            title: "Дегустация новой линейки",
            client: "ВкусВилл",
            date: relativeDate(2),
            budget: 32000,
            status: "new",
            address: "Москва, ул. Лесная, 7",
            type: "Дегустация",
        },
        {
            id: 1046,
            title: "Листовки у метро",
            client: "Самокат",
            date: relativeDate(3),
            budget: 18500,
            status: "work",
            address: "Москва, м. Белорусская",
            type: "Раздача листовок",
        },
        {
            id: 1045,
            title: "Осенний фестиваль",
            client: "Яндекс",
            date: relativeDate(5),
            budget: 120000,
            status: "new",
            address: "Москва, Хлебозавод № 9",
            type: "Мероприятие",
        },
        {
            id: 1044,
            title: "Промо в торговом центре",
            client: "ЛЭТУАЛЬ",
            date: relativeDate(6),
            budget: 28000,
            status: "work",
            address: "Москва, ТЦ «Метрополис»",
            type: "Промоакция",
        },
        {
            id: 1043,
            title: "Презентация коллекции",
            client: "LIME",
            date: relativeDate(7),
            budget: 64000,
            status: "new",
            address: "Москва, универмаг «Цветной»",
            type: "Презентация",
        },
        {
            id: 1042,
            title: "Открытие кофейни",
            client: "Surf Coffee",
            date: relativeDate(-2),
            budget: 24000,
            status: "done",
            address: "Москва, ул. Покровка, 12",
            type: "Промоакция",
        },
        {
            id: 1041,
            title: "Промо выходного дня",
            client: "Спортмастер",
            date: relativeDate(-4),
            budget: 36000,
            status: "cancel",
            address: "Москва, ТЦ «Европейский»",
            type: "Промоакция",
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
    let page = "requests",
        activeFilter = "all",
        query = "",
        sort = "date",
        toastTimer;
    const pages = {
        requests: [
            "Заявки",
            "От первого контакта до успешного мероприятия.",
            "Все заявки",
            "Управляйте проектами в одном месте",
        ],
        clients: [
            "Клиенты",
            "Компании, с которыми мы создаём события.",
            "Все клиенты",
            "Клиенты из ваших заявок",
        ],
        history: [
            "История заказов",
            "Проекты, которые мы успешно завершили.",
            "Завершённые заказы",
            "Результаты работы вашей команды",
        ],
        canceled: [
            "Отменённые заявки",
            "Отменённые проекты остаются в истории.",
            "Отменённые заказы",
            "Откройте заявку, чтобы изменить её статус",
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
                "Изменения доступны до закрытия страницы: сохранение в браузере недоступно.",
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
            ["Всего заявок", requests.length, "Все проекты пространства", "▦"],
            ["В работе", count("work"), "Команды уже на проектах", "◷"],
            ["Новые заявки", count("new"), "Ожидают начала работы", "↗"],
            ["Завершено", count("done"), "События состоялись", "✓"],
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
        document.title = `ВашПромоутер — ${meta[0]}`;
        document.querySelectorAll("[data-page]").forEach((a) => {
            a.classList.toggle("active", a.dataset.page === page);
            if (a.dataset.page === page) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
        document.querySelector("#tabs").hidden = page !== "requests";
        document.querySelector("#sort").hidden = !["requests", "history", "canceled"].includes(page);
        document.querySelector("#search").placeholder =
            page === "clients"
                ? "Найти клиента…"
                : "Найти заявку или клиента…";
        document.querySelector("#tabs").innerHTML = [
            ["all", "Все заявки"],
            ["new", "Новые"],
            ["work", "В работе"],
            ["done", "Завершённые"],
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
                ["Проект / клиент", "Дата", "Статус", "Бюджет"],
                rows.map(
                    (r, i) =>
                        `<tr><td><div class="project-cell"><span class="project-icon tone-${i % 4}" aria-hidden="true">${["▧", "◈", "▤", "✳"][i % 4]}</span><div><button class="project-link" data-detail="${r.id}">${escapeHtml(r.title)}</button><span class="project-sub">#${r.id} · ${escapeHtml(r.client)}</span></div></div></td><td><time datetime="${r.date}">${dateLabel(r.date)}</time></td><td>${badge(r.status)}</td><td class="budget">${money(r.budget)}</td></tr>`,
                ),
            );
        } else if (page === "clients") {
            const rows = clients();
            count = rows.length;
            html = table(
                ["Компания", "Заявок", "В работе", "Бюджет заявок"],
                rows.map(
                    (c) =>
                        `<tr><td><strong>${escapeHtml(c.name)}</strong></td><td>${c.orders.length}</td><td>${c.orders.filter((r) => r.status === "work").length}</td><td class="budget">${money(c.orders.reduce((n, r) => n + r.budget, 0))}</td></tr>`,
                ),
            );
        }
        document.querySelector("#data-view").innerHTML = count
            ? html
            : '<div class="empty"><strong>Здесь пока ничего нет</strong>Попробуйте другой запрос или добавьте новую заявку.</div>';
        document.querySelector("#total-count").textContent = count;
        document.querySelector("#result-count").textContent = `Показано записей: ${count}`;

    }
    function openDetail(id) {
        const r = requests.find((r) => r.id === id);
        if (!r) return;
        document.querySelector("#detail-content").innerHTML =
            [
                ["Проект", r.title],
                ["Клиент", r.client],
                ["Дата", dateLabel(r.date)],
                ["Адрес", r.address],
                ["Бюджет", money(r.budget)],
            ]
                .map(
                    ([label, value]) =>
                        `<div class="detail-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`,
                )
                .join("") +
            `<label class="detail-row" for="status-select">Статус<select id="status-select" data-id="${r.id}">${Object.entries(
                statuses,
            )
                .map(
                    ([key, label]) =>
                        `<option value="${key}" ${r.status === key ? "selected" : ""}>${label}</option>`,
                )
                .join(
                    "",
                )}</select></label><p class="muted" style="margin-top:16px">Изменение статуса сохраняется автоматически в этом браузере.</p>`;
        document.querySelector("#detail-dialog").showModal();
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
    });
    document.querySelector("#new-request").addEventListener("click", () => {
        document.querySelector("#request-form").reset();
        document.querySelector("#request-form").elements.date.value = relativeDate(1);
        document.querySelector("#request-dialog").showModal();
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
            notify("Заполните название, клиента и адрес.");
            return;
        }
        const r = {
            id: Math.max(1040, ...requests.map((r) => r.id)) + 1,
            title,
            client,
            address,
            date: data.get("date"),
            budget: Number(data.get("budget")),
            status: "new",
            type: "Промоакция",
        };
        requests.unshift(r);
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
        if (persisted) notify("Заявка создана");
    });
    document.querySelector("#detail-content").addEventListener("change", (e) => {
        if (e.target.id !== "status-select") return;
        const r = requests.find((r) => r.id === Number(e.target.dataset.id));
        r.status = e.target.value;
        const persisted = save();
        render();
        if (persisted) notify("Статус заявки обновлён");
    });
    document.querySelector("#export-button").addEventListener("click", () => {
        let rows;
        if (page === "clients")
            rows = [
                ["Компания", "Заявок", "Бюджет"],
                ...clients().map((c) => [
                    c.name,
                    c.orders.length,
                    c.orders.reduce((n, r) => n + r.budget, 0),
                ]),
            ];
        else
            rows = [
                ["Номер", "Проект", "Клиент", "Дата", "Статус", "Бюджет", "Адрес"],
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
        notify("CSV подготовлен для скачивания");
    });
    document.querySelector("#logout-button").addEventListener("click", () => {
        localStorage.removeItem("vash-promouter-session-v1");
        location.replace("login.html");
    });
    route();
}
