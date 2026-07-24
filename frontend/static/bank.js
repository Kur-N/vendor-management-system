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
                if (id != "bank") {
                  window.location.href = url;
                }
              },
            },
          },
          {
            type: "clean",
            rows: [
              {
                template: "<h2>Bank</h2>",
                height: 60,
              },
              {
                view: "toolbar",
                id: "bankToolbar",
                height: 40,
                elements: [
                  {},
                  {
                    view: "button",
                    id: "btnAdd",
                    label: "Tambah Bank",
                    type: "icon",
                    icon: "mdi mdi-plus",
                    css: "webix_primary",
                    width: 140,
                  },
                  {
                    view: "button",
                    id: "btnEdit",
                    label: "Edit Vendor",
                    css: "webix_secondary",
                    type: "icon",
                    icon: "mdi mdi-pencil",
                    width: 140,
                  },
                  {
                    view: "button",
                    label: "Delete Bank",
                    id: "btnDelete",
                    type: "icon",
                    icon: "mdi mdi-delete",
                    css: "webix_danger",
                    width: 140,
                  },
                  { width: 20 },
                ],
              },
              { height: 10 },
              {
                view: "form",
                id: "bankForm",
                elements: [
                  {
                    view: "text",
                    name: "bankName",
                    id: "bankName",
                    label: "Bank Name:",
                  },
                  {
                    view: "text",
                    name: "bankDesc",
                    id: "bankDesc",
                    label: "Bank Desc:",
                  },
                  {
                    cols: [
                      {
                        view: "radio",
                        label: "Active Status:",
                        name: "activeStatus",
                        options: [
                          { id: "Y", value: "Active" },
                          { id: "T", value: "Inactive" },
                        ],
                      },
                      {
                        view: "button",
                        label: "Clear",
                        id: "btnClear",
                        css: "webix_transparent",
                        width: 100,
                      },
                    ],
                  },
                ],
                rules: {
                  $all: webix.rules.isNotEmpty,
                },
                elementsConfig: {
                  labelWidth: 100,
                },
              },
              {
                cols: [
                  {
                    view: "pager",
                    id: "myPager",
                    page: 0,
                    size: 10,
                    autosize: true,
                    group: 5,
                    template:
                      "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}",
                  },
                ],
              },
              {
                view: "dataview",
                id: "bankDataview",
                pager: "myPager",
                select: "single",
                scroll: "auto",
                autoWidth: true,
                data: bankData,
                template: function (obj) {
                  const cardClass =
                    obj.activeStatus === "Y" ? "card active" : "card inactive";
                  return `
                                    <div class="${cardClass}">
                                        <div class="name">${obj._id}</div>
                                        <div class="info">Deskripsi: ${obj.bankDesc}</div>
                                    </div>
                                `;
                },
                type: {
                  width: 250,
                  height: 120,
                },
                on: {
                  onAfterSelect: function (id) {
                    let selectedItem = this.getItem(id);
                    let selectedId = selectedItem._id;

                    if ($$("bankSetup")) {
                      $$("bankSetup").clearAll();
                      $$("bankSetup").parse([
                        {
                          _id: selectedId,
                          createDate: selectedItem.setup.createDate,
                          createUser: selectedItem.setup.createUser,
                          updateUser: selectedItem.setup.updateUser,
                          updateDate: selectedItem.setup.updateDate,
                        },
                      ]);
                    }
                    if ($$("bankName")) {
                      $$("bankName").setValue(selectedId);
                      $$("bankName").define("readonly", true);
                      $$("bankName").refresh();
                    }
                    if ($$("bankForm")) {
                      $$("bankForm").setValues(selectedItem, true);
                    }
                  },
                },
              },
              {
                view: "dataview",
                id: "bankSetup",
                scroll: false,
                select: false,
                autoWidth: true,
                hidden: true,
                template: function (obj) {
                  return `
                                    <div class="card">
                                        <div class="name">${obj._id}</div>
                                        <div class="info">Create Date: ${obj.createDate}</div>
                                        <div class="info">Create User: ${obj.createUser}</div>
                                        <div class="info">Update User: ${obj.updateUser}</div>
                                        <div class="info">Update Date: ${obj.updateDate}</div>
                                    </div>
                                `;
                },
                type: {
                  width: 400,
                  height: 220,
                },
              },
            ],
          },
        ],
      },
    ],
  });
});

webix.ready(function () {
  if ($$("mySidebar")) $$("mySidebar").select("bank");

  if ($$("btnClear")) {
    $$("btnClear").attachEvent("onItemClick", function () {
      if ($$("bankForm")) $$("bankForm").clear();
      if ($$("bankSetup")) $$("bankSetup").hide();
      if ($$("bankDataview")) $$("bankDataview").unselectAll();
      if ($$("bankName")) {
        $$("bankName").define("readonly", false);
        $$("bankName").refresh();
      }
    });
  }

  if ($$("btnAdd")) {
    $$("btnAdd").attachEvent("onItemClick", function () {
      let selectedId = $$("bankDataview")
        ? $$("bankDataview").getSelectedId()
        : null;
      if (!selectedId) {
        const values = $$("bankForm").getValues();
        if ($$("bankForm").validate()) {
          webix.confirm({
            title: "Tambah Bank",
            text: "Apakah Anda yakin ingin menambahkan data ini?",
            ok: "Ya",
            cancel: "Tidak",
            callback: function (result) {
              if (result) {
                webix
                  .ajax()
                  .headers({
                    "Content-type": "application/json",
                  })
                  .post("/bank", JSON.stringify(values), {
                    success: function (text, data, xhr) {
                      let response = data.json();
                      webix.alert({
                        title: "Tambah Bank",
                        text: response.message,
                        callback: function () {
                          location.reload();
                        },
                      });
                    },
                    error: function (text, data, xhr) {
                      let response = data.json();
                      webix.alert({
                        type: "alert-error",
                        title: "Tambah Bank",
                        text: response.message,
                      });
                    },
                  });
              }
            },
          });
        } else {
          webix.message({
            type: "error",
            text: "Isi semua data Form!",
          });
        }
      } else {
        webix.message({
          type: "error",
          text: "Clear data terlebih dahulu anda dalam mode edit!",
        });
      }
    });
  }

  if ($$("btnEdit")) {
    $$("btnEdit").attachEvent("onItemClick", function () {
      let selectedId = $$("bankDataview")
        ? $$("bankDataview").getSelectedId()
        : null;
      if (!selectedId) {
        webix.message({
          type: "error",
          text: "Silahkan pilih data Bank dahulu",
        });
        return;
      }

      const values = $$("bankForm").getValues();
      if ($$("bankForm").validate()) {
        webix.confirm({
          type: "confirm-warning",
          title: "Edit Bank",
          text: "Apakah Anda ingin mengedit bank " + selectedId + "?",
          ok: "Ya",
          cancel: "Tidak",
          callback: function (result) {
            if (result) {
              webix
                .ajax()
                .headers({
                  "Content-type": "application/json",
                })
                .put("/bank/" + selectedId, JSON.stringify(values), {
                  success: function (text, data, xhr) {
                    let response = data.json();
                    webix.alert({
                      title: "Update Bank",
                      text: response.message,
                      callback: function () {
                        location.reload();
                      },
                    });
                  },
                  error: function (text, data, xhr) {
                    let response = data.json();
                    webix.alert({
                      type: "alert-error",
                      title: "Update Bank",
                      text: response.message,
                    });
                  },
                });
            }
          },
        });
      } else {
        webix.message({
          type: "error",
          text: "Isi semua data Form!",
        });
      }
    });
  }

  if ($$("btnDelete")) {
    $$("btnDelete").attachEvent("onItemClick", function () {
      let selectedId = $$("bankDataview")
        ? $$("bankDataview").getSelectedId()
        : null;
      if (!selectedId) {
        webix.message({
          type: "error",
          text: "Silahkan pilih data Bank dahulu",
        });
        return;
      }

      webix.confirm({
        type: "confirm-error",
        title: "Delete Bank",
        text: "Apakah Anda ingin menghapus bank " + selectedId + "?",
        ok: "Ya",
        cancel: "Tidak",
        callback: function (result) {
          if (result) {
            webix
              .ajax()
              .headers({
                "Content-type": "application/json",
              })
              .del("/bank/" + selectedId)
              .then(function (response) {
                let resJson = response.json();
                webix.alert({
                  title: "Delete Bank",
                  text: resJson.message,
                  callback: function () {
                    location.reload();
                  },
                });
              })
              .fail(function (response) {
                let resJson = response.json();
                webix.alert({
                  type: "alert-error",
                  title: "Delete Bank",
                  text: resJson.message,
                });
              });
          }
        },
      });
    });
  }

  // Default state for non-admin / initial load
  if ($$("bankToolbar")) $$("bankToolbar").hide();
  if ($$("bankSetup")) $$("bankSetup").hide();
  if ($$("bankForm")) $$("bankForm").disable();
  if ($$("btnAdd")) $$("btnAdd").hide();
  if ($$("btnEdit")) $$("btnEdit").hide();
  if ($$("btnDelete")) $$("btnDelete").hide();
  if ($$("mySidebar")) {
    $$("mySidebar").filter(function (obj) {
      return obj.id != "user";
    });
  }
});

webix.ready(function () {
  webix
    .ajax()
    .get("/session")
    .then(function (response) {
      appState.session = response.json();
      appState.username = appState.session.data.username;
      appState.role = appState.session.data.role;

      if (appState.role == "admin") {
        if ($$("bankForm")) $$("bankForm").enable();
        if ($$("btnAdd")) $$("btnAdd").show();
        if ($$("btnEdit")) $$("btnEdit").show();
        if ($$("btnDelete")) $$("btnDelete").show();
        if ($$("bankToolbar")) $$("bankToolbar").show();

        webix.ready(function () {
          if ($$("bankDataview")) {
            $$("bankDataview").attachEvent("onAfterSelect", function () {
              if ($$("bankSetup")) $$("bankSetup").show();
            });
          }
          if ($$("mySidebar")) {
            $$("mySidebar").filter(function (obj) {
              return true;
            });
          }
        });
      }
    })
    .catch(function (error) {
      console.log("Gagal mendapatkan data", error);
    });
});
