var menu_data = [
  { id: "dashboard", icon: "mdi mdi-view-dashboard", value: "Dashboards" },
  { id: "vendor", icon: "mdi mdi-handshake", value: "Vendor" },
  { id: "branch", icon: "mdi mdi-store", value: "Cabang" },
  { id: "bank", icon: "mdi mdi-bank", value: "BANK" },
  { id: "user", icon: "mdi mdi-account-edit", value: "User" },
];

const appState = {
  session: null,
  username: null,
  role: null,
};

function countData(data) {
  if (Array.isArray(data)) {
    return data.length;
  } else {
    console.error("Input data harus berupa array.");
    return 0;
  }
}

// Hitung jumlah data
const totalVendors = countData(vendors.data);
const totalBranches = countData(branches.data);
const totalUsers = countData(users.data);
const totalBank = countData(bank.data);

const data = [
  { id: 1, value: totalVendors, label: "Vendors" },
  { id: 2, value: totalBranches, label: "Branches" },
  { id: 3, value: totalUsers, label: "Users" },
  { id: 4, value: totalBank, label: "Bank" },
];

webix.ready(function () {
  webix.ui({
    rows: [
      {
        view: "toolbar",
        padding: 3,
        height: 50,
        elements: [
          {
            view: "icon",
            icon: "mdi mdi-menu",
            click: function () {
              if ($$("mySidebar")) $$("mySidebar").toggle();
            },
          },
          { view: "label", label: "VMS App" },
          {},
          {
            view: "button",
            type: "icon",
            icon: "mdi mdi-logout",
            label: "Logout",
            css: "webix_danger",
            width: 120,
            click: function () {
              window.location.href = "/logout";
            },
          },
        ],
      },
      {
        cols: [
          {
            view: "sidebar",
            id: "mySidebar",
            data: menu_data,
            width: 200,
            on: {
              onAfterSelect: function (id) {
                let url = "/" + id;
                if (id != "dashboard") {
                  window.location.href = url;
                }
              },
            },
          },
          {
            type: "clean",
            rows: [
              {
                view: "template",
                id: "userHeader",
                template: "<h2>Selamat Datang di VMS App</h2>",
                height: 60,
              },
              { height: 10 },
              {
                type: "space",
                align: "center, middle",
                height: 124,
                cols: [
                  {},
                  {
                    view: "dataview",
                    id: "summary",
                    ycount: 1,
                    width: 4 * 150,
                    scroll: "auto",
                    type: {
                      height: 100,
                      width: 150,
                      template:
                        "<div style='text-align:center'><h3>#value#</h3><p>#label#</p></div>",
                    },
                  },
                  {},
                ],
              },
              {},
            ],
          },
        ],
      },
    ],
  });
});

function filterData() {
  const filteredData = data.filter((item) => item.label !== "Users");
  if ($$("summary")) {
    $$("summary").clearAll();
    $$("summary").parse(filteredData);
  }
}

function showAllData() {
  if ($$("summary")) {
    $$("summary").clearAll();
    $$("summary").parse(data);
  }
}

webix.ready(function () {
  if ($$("mySidebar")) {
    $$("mySidebar").filter(function (obj) {
      return obj.id != "user";
    });
    $$("mySidebar").select("dashboard");
  }
  filterData();
});

webix.ready(function () {
  webix
    .ajax()
    .get("/session")
    .then(function (response) {
      appState.session = response.json();
      appState.username = appState.session.data.username;
      appState.role = appState.session.data.role;

      if ($$("userHeader")) {
        $$("userHeader").setHTML(
          `<h2>Selamat Datang ${appState.username} di VMS App</h2>`,
        );
      }

      if (appState.role == "admin") {
        if ($$("mySidebar")) {
          $$("mySidebar").filter(function (obj) {
            return true;
          });
        }
        showAllData();
      }
    })
    .catch(function (error) {
      console.log("Gagal mendapatkan data", error);
    });
});
