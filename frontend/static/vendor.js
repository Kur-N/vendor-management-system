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

function loadBanks() {
  webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
    })
    .get("/get-bank")
    .then(function (response) {
      const banks = response.json().data;
      const checkboxBank = banks.map((bank) => ({
        view: "checkbox",
        id: `checkbox_${bank._id}`,
        labelRight: bank._id,
        name: bank._id,
        value: 0,
      }));
      if ($$("bankCheckbox")) {
        $$("bankCheckbox").addView({
          rows: checkboxBank,
        });
      }
    })
    .catch(function (error) {
      webix.alert({
        type: "alert-error",
        title: "Error",
        text: "Failed to load banks data",
      });
      console.log(error);
    });
}

webix.ready(function () {
  loadBanks();
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
            id: "btnLogout",
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
                if (id != "vendor") {
                  window.location.href = url;
                }
              },
            },
          },
          {
            type: "clean",
            rows: [
              {
                template: "<h2>Vendor VMS App</h2>",
                height: 60,
              },
              {
                view: "toolbar",
                elements: [
                  {
                    view: "button",
                    id: "btnUnselect",
                    label: "Unselect",
                    css: "webix_secondary",
                    width: 100,
                  },
                  {
                    view: "pager",
                    id: "myPager",
                    page: 0,
                    size: 10,
                    width: 300,
                    group: 5,
                    template:
                      "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}",
                  },
                  {},
                  {
                    view: "button",
                    id: "btnAdd",
                    label: "Tambah Vendor",
                    type: "icon",
                    icon: "mdi mdi-plus",
                    css: "webix_primary",
                    width: 160,
                  },
                  {
                    view: "button",
                    label: "Delete Vendor",
                    id: "btnDelete",
                    type: "icon",
                    icon: "mdi mdi-delete",
                    css: "webix_danger",
                    width: 160,
                  },
                  {
                    view: "button",
                    id: "btnInfo",
                    label: "Info Details",
                    css: "webix_transparent",
                    type: "icon",
                    icon: "mdi mdi-magnify",
                    width: 120,
                  },
                  { width: 20 },
                ],
              },
              { height: 6 },
              {
                type: "clean",
                cols: [
                  {
                    view: "dataview",
                    id: "vendorDataview",
                    scroll: "auto",
                    select: "single",
                    autowidth: true,
                    pager: "myPager",
                    ycount: 2,
                    data: vendorData,
                    template: function (obj) {
                      const cardClass =
                        obj.activeStatus === "Y"
                          ? "card active"
                          : "card inactive";
                      return `
                                            <div class="${cardClass}">
                                                <div class="name">${obj.vendorName}</div>
                                                <div class="info">Tipe: ${obj.partnerType}</div>
                                                <div class="info">Unit Usaha: ${obj.unitUsaha}</div>
                                                <div class="info">Alamat: ${obj.address}, ${obj.province}, ${obj.country}</div>
                                                <div class="info">No Telp: ${obj.noTelp}</div>
                                                <div class="info">Email: ${obj.emailCompany}</div>
                                                <div class="info">Nama PIC: ${obj.namePIC} (${obj.positionPIC})</div>
                                                <div class="info">Email PIC: ${obj.emailPIC}</div>
                                            </div>
                                        `;
                    },
                    type: {
                      width: 350,
                      height: 300,
                    },
                    on: {
                      onAfterSelect: function (id) {
                        let selectedItem = this.getItem(id);
                        let selectedId = selectedItem._id;

                        if ($$("btnUnselect")) {
                          $$("btnUnselect").attachEvent(
                            "onItemClick",
                            function () {
                              this.detachEvent("onAfterSelect");
                              selectedId = null;
                              selectedItem = null;
                              if ($$("vendorDataview"))
                                $$("vendorDataview").unselectAll();
                            },
                          );
                        }
                        if ($$("btnInfo")) {
                          $$("btnInfo").attachEvent("onItemClick", function () {
                            if (selectedId !== null || selectedItem !== null) {
                              webix.confirm({
                                title: selectedItem.vendorName,
                                text: "Tekan Ok untuk melihat detail",
                                callback: function (result) {
                                  if (result) {
                                    window.location.href =
                                      "/vendor/" + selectedId;
                                  } else {
                                    selectedId = null;
                                    selectedItem = null;
                                    location.reload();
                                  }
                                },
                              });
                            }
                          });
                        }
                        if ($$("btnDelete")) {
                          $$("btnDelete").attachEvent(
                            "onItemClick",
                            function () {
                              if (
                                selectedId !== null ||
                                selectedItem !== null
                              ) {
                                webix.confirm({
                                  type: "confirm-error",
                                  title: "Delete Vendor",
                                  text:
                                    "Apakah anda yakin untuk menghapus data Vendor " +
                                    selectedItem.vendorName +
                                    "?",
                                  ok: "Ya",
                                  cancel: "Tidak",
                                  callback: function (result) {
                                    if (result) {
                                      webix
                                        .ajax()
                                        .headers({
                                          "Content-type": "application/json",
                                        })
                                        .del("/vendor/" + selectedId)
                                        .then(function (response) {
                                          let resJson = response.json();
                                          webix.alert({
                                            title: "Delete Vendor",
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
                                            title: "Delete Vendor",
                                            text: resJson.message,
                                          });
                                        });
                                    } else {
                                      selectedId = null;
                                      selectedItem = null;
                                      location.reload();
                                    }
                                  },
                                });
                              }
                            },
                          );
                        }
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  // Window: Add Vendor
  webix.ui({
    view: "window",
    id: "addVendorWindow",
    height: 650,
    width: 1000,
    scroll: "auto",
    position: "center",
    modal: true,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        { view: "label", label: "Tambah Vendor" },
        {
          view: "button",
          label: "Batal",
          id: "btnBatal",
          css: "webix_secondary",
          width: 100,
          click: function () {
            if ($$("addVendorWindow")) $$("addVendorWindow").hide();
          },
        },
      ],
    },
    body: {
      view: "form",
      id: "addVendorForm",
      scroll: "auto",
      elements: [
        {
          cols: [
            {
              rows: [
                {
                  view: "text",
                  label: "Partner Type",
                  name: "partnerType",
                },
                {
                  view: "text",
                  label: "Vendor Name",
                  name: "vendorName",
                },
                {
                  view: "text",
                  label: "Unit Usaha",
                  name: "unitUsaha",
                },
                {
                  view: "text",
                  label: "Address",
                  name: "address",
                },
                {
                  view: "text",
                  label: "Country",
                  name: "country",
                },
                {
                  view: "text",
                  label: "Province",
                  name: "province",
                },
                {
                  view: "text",
                  label: "No. Telp",
                  name: "noTelp",
                },
                {
                  view: "text",
                  label: "Email Company",
                  name: "emailCompany",
                },
              ],
            },
            { width: 100 },
            {
              rows: [
                {
                  view: "text",
                  label: "Name PIC",
                  name: "namePIC",
                },
                {
                  view: "text",
                  label: "Email PIC",
                  name: "emailPIC",
                },
                {
                  view: "text",
                  label: "Position PIC",
                  name: "positionPIC",
                },
                {
                  view: "radio",
                  label: "Active Status",
                  name: "activeStatus",
                  options: [
                    { id: "Y", value: "Active" },
                    { id: "T", value: "Inactive" },
                  ],
                },
                {
                  view: "fieldset",
                  label: "Bank:",
                  id: "bankVendor",
                  body: {
                    height: 250,
                    view: "scrollview",
                    scroll: "auto",
                    body: {
                      id: "bankCheckbox",
                      rows: [],
                    },
                  },
                },
                {
                  cols: [
                    {},
                    {
                      view: "button",
                      label: "Clear",
                      id: "btnClear",
                      css: "webix_transparent",
                      width: 100,
                      click: function () {
                        if ($$("addVendorForm")) $$("addVendorForm").clear();
                      },
                    },
                    { width: 10 },
                    {
                      view: "button",
                      label: "Tambah",
                      id: "btnTambah",
                      css: "webix_primary",
                      width: 100,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      rules: {
        $all: webix.rules.isNotEmpty,
        emailCompany: webix.rules.isEmail,
        emailPIC: webix.rules.isEmail,
      },
      elementsConfig: {
        labelPosition: "top",
      },
    },
  });
});

function getSelectedBank() {
  if (!$$("bankCheckbox")) return [];
  const bankCheckboxes = $$("bankCheckbox").queryView(
    { view: "checkbox" },
    "all",
  );
  const selectedBank = bankCheckboxes
    .filter((checkbox) => checkbox.getValue() == 1)
    .map((checkbox) => checkbox.config.name);
  return selectedBank;
}

webix.ready(function () {
  if ($$("mySidebar")) $$("mySidebar").select("vendor");

  if ($$("btnInfo")) {
    $$("btnInfo").attachEvent("onItemClick", function () {
      let selectedId = $$("vendorDataview")
        ? $$("vendorDataview").getSelectedId()
        : null;
      if (!selectedId || selectedId.isEmpty) {
        webix.message({
          text: "Silahkan pilih data Vendor dahulu",
        });
      }
    });
  }

  if ($$("btnDelete")) {
    $$("btnDelete").attachEvent("onItemClick", function () {
      let selectedId = $$("vendorDataview")
        ? $$("vendorDataview").getSelectedId()
        : null;
      if (!selectedId) {
        webix.message({
          text: "Silahkan pilih data Vendor dahulu",
        });
      }
    });
  }

  if ($$("btnAdd")) {
    $$("btnAdd").attachEvent("onItemClick", function () {
      if ($$("addVendorWindow")) $$("addVendorWindow").show();
    });
  }

  if ($$("btnTambah")) {
    $$("btnTambah").attachEvent("onItemClick", function () {
      const values = $$("addVendorForm") ? $$("addVendorForm").getValues() : {};
      const selectedBank = getSelectedBank();
      values.accountBank = selectedBank;

      let message = "Isi Form sesuai dengan ketentuan";
      if ($$("addVendorForm") && $$("addVendorForm").validate()) {
        webix
          .ajax()
          .headers({
            "Content-type": "application/json",
          })
          .post("/vendor", JSON.stringify(values), {
            success: function (text, data, xhr) {
              let response = data.json();
              webix.alert({
                title: "Tambah Vendor",
                text: response.message,
                callback: function () {
                  window.location.href = "/vendor";
                },
              });
            },
            error: function (text, data, xhr) {
              let response = data.json();
              webix.alert({
                type: "alert-error",
                title: "Tambah Vendor",
                text: response.message,
              });
            },
          });
      } else {
        webix.message({
          type: "error",
          text: message,
        });
      }
    });
  }

  // Default Form State
  if ($$("addVendorForm")) $$("addVendorForm").disable();
  if ($$("btnTambah")) $$("btnTambah").hide();
  if ($$("btnAdd")) $$("btnAdd").hide();
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
        if ($$("addVendorForm")) $$("addVendorForm").enable();
        if ($$("btnTambah")) $$("btnTambah").show();
        if ($$("btnAdd")) $$("btnAdd").show();
        if ($$("btnDelete")) $$("btnDelete").show();
        if ($$("mySidebar")) {
          $$("mySidebar").filter(function (obj) {
            return true;
          });
        }
      }
    })
    .catch(function (error) {
      console.log("Gagal mendapatkan data", error);
    });
});
