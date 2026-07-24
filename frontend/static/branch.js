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

function loadVendors() {
  webix
    .ajax()
    .headers({
      "Content-type": "application/json",
    })
    .get("/get-vendor")
    .then(function (response) {
      const vendorData = response.json();
      if ($$("vendorDataview")) {
        $$("vendorDataview").parse(vendorData);
      }
    })
    .catch(function (error) {
      webix.alert({
        type: "alert-error",
        title: "Error",
        text: "Failed to load vendors data",
      });
      console.log(error);
    });
}

webix.ready(function () {
  loadVendors();
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
                if (id != "branch") {
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
                id: "vendorHeader",
                template: `<h2>Cabang Vendor </h2>`,
                height: 60,
              },
              {
                view: "scrollview",
                scroll: "y",
                height: 800,
                body: {
                  rows: [
                    {
                      view: "toolbar",
                      autoheight: true,
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
                          size: 8,
                          autosize: true,
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
                      autoheight: true,
                      cols: [
                        {
                          view: "dataview",
                          id: "vendorDataview",
                          scroll: "auto",
                          select: "single",
                          autowidth: true,
                          pager: "myPager",
                          yCount: 2,
                          height: 310,
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
                                                        </div>
                                                    `;
                          },
                          type: {
                            width: 400,
                            height: 150,
                          },
                          on: {
                            onAfterSelect: function (id) {
                              let selectedItem = this.getItem(id);
                              let selectedId = selectedItem._id;
                              if ($$("vendorHeader")) {
                                $$("vendorHeader").setHTML(
                                  `<h2>Cabang Vendor ${selectedItem.vendorName}</h2>`,
                                );
                              }
                              if ($$("branchDatatable")) {
                                $$("branchDatatable").clearAll();
                                const data = branchData.data.filter(
                                  (branch) => branch.vendor_id == selectedId,
                                );
                                $$("branchDatatable").parse({ data });
                                $$("branchDatatable").show();
                              }
                              if ($$("branchToolbar"))
                                $$("branchToolbar").show();
                              if ($$("footBranch")) $$("footBranch").show();

                              if ($$("btnAddBranch")) {
                                $$("btnAddBranch").attachEvent(
                                  "onItemclick",
                                  function () {
                                    if ($$("vendor_id"))
                                      $$("vendor_id").setValue(selectedId);
                                  },
                                );
                              }
                              if ($$("btnClear")) {
                                $$("btnClear").attachEvent(
                                  "onItemClick",
                                  function () {
                                    if ($$("vendor_id"))
                                      $$("vendor_id").setValue(selectedId);
                                  },
                                );
                              }
                              if ($$("btnClearEdit")) {
                                $$("btnClearEdit").attachEvent(
                                  "onItemClick",
                                  function () {
                                    if ($$("vendor_idEdit"))
                                      $$("vendor_idEdit").setValue(selectedId);
                                  },
                                );
                              }
                              if ($$("btnUnselect")) {
                                $$("btnUnselect").attachEvent(
                                  "onItemClick",
                                  function () {
                                    this.detachEvent("onAfterSelect");
                                    selectedId = null;
                                    selectedItem = null;
                                    if ($$("vendorDataview"))
                                      $$("vendorDataview").unselectAll();
                                    if ($$("vendorHeader"))
                                      $$("vendorHeader").setHTML(
                                        `<h2>Cabang Vendor </h2>`,
                                      );
                                    if ($$("branchDatatable")) {
                                      $$("branchDatatable").unselectAll();
                                      $$("branchDatatable").hide();
                                    }
                                    if ($$("branchSetup"))
                                      $$("branchSetup").clearAll();
                                    if ($$("branchToolbar"))
                                      $$("branchToolbar").hide();
                                    if ($$("footBranch"))
                                      $$("footBranch").hide();
                                  },
                                );
                              }
                              if ($$("btnInfo")) {
                                $$("btnInfo").attachEvent(
                                  "onItemClick",
                                  function () {
                                    if (
                                      selectedId !== null ||
                                      selectedItem !== null
                                    ) {
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
                                  },
                                );
                              }
                            },
                          },
                        },
                      ],
                    },
                    { height: 20 },
                    {
                      view: "toolbar",
                      id: "branchToolbar",
                      hidden: true,
                      autoheight: true,
                      elements: [
                        { width: 6 },
                        {
                          view: "label",
                          label: "Toolbar",
                        },
                        {},
                        {
                          view: "button",
                          id: "btnAddBranch",
                          value: "Tambah Cabang",
                          css: "webix_primary",
                          width: 180,
                        },
                        {
                          view: "button",
                          id: "btnEditBranch",
                          value: "Edit Cabang",
                          css: "webix_secondary",
                          width: 180,
                        },
                        {
                          view: "button",
                          id: "btnDeleteBranch",
                          value: "Hapus Cabang",
                          css: "webix_danger",
                          width: 180,
                        },
                      ],
                    },
                    {
                      view: "datatable",
                      id: "branchDatatable",
                      hidden: true,
                      autoheight: true,
                      scroll: false,
                      select: true,
                      pager: "branchPager",
                      columns: [
                        { id: "index", header: "#", adjust: "data", width: 10 },
                        {
                          id: "_id",
                          header: "Kode Cabang",
                          adjust: "data",
                          fillspace: 2,
                        },
                        {
                          id: "activeStatus",
                          header: "Status",
                          adjust: true,
                          fillspace: 1,
                        },
                        {
                          id: "BranchName",
                          header: "Nama Cabang",
                          adjust: true,
                          fillspace: 3,
                        },
                      ],
                      on: {
                        onAfterLoad: function () {
                          if (this.count() == 0) {
                            this.add({ _id: "Tidak ada data" });
                          }
                        },
                        "data->onStoreUpdated": function () {
                          this.data.each(function (obj, i) {
                            obj.index = i + 1;
                          });
                        },
                        onAfterSelect: function (id) {
                          let selectedItem = this.getItem(id);
                          let selectedId = selectedItem._id;
                          if ($$("branchSetup")) {
                            $$("branchSetup").clearAll();
                            $$("branchSetup").parse({
                              _id: selectedId,
                              createDate: selectedItem.setup.createDate,
                              createUser: selectedItem.setup.createUser,
                              updateUser: selectedItem.setup.updateUser,
                              updateDate: selectedItem.setup.updateDate,
                            });
                          }
                          if ($$("btnClearEdit")) {
                            $$("btnClearEdit").attachEvent(
                              "onItemClick",
                              function () {
                                if ($$("cabang_id"))
                                  $$("cabang_id").setValue(selectedId);
                              },
                            );
                          }
                          if ($$("btnUnselectBranch")) {
                            $$("btnUnselectBranch").attachEvent(
                              "onItemClick",
                              function () {
                                this.detachEvent("onAfterSelect");
                                selectedId = null;
                                selectedItem = null;
                                if ($$("branchDatatable"))
                                  $$("branchDatatable").unselectAll();
                                if ($$("branchSetup"))
                                  $$("branchSetup").clearAll();
                              },
                            );
                          }
                        },
                      },
                    },
                    {
                      id: "footBranch",
                      hidden: true,
                      autoheight: true,
                      cols: [
                        {
                          view: "pager",
                          id: "branchPager",
                          page: 0,
                          group: 3,
                          size: 5,
                          template:
                            "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}",
                        },
                        {},
                        {
                          view: "button",
                          label: "Unselect Cabang",
                          id: "btnUnselectBranch",
                          css: "webix_transparent",
                          width: 180,
                        },
                      ],
                    },
                    {
                      view: "dataview",
                      id: "branchSetup",
                      scroll: false,
                      select: false,
                      autoWidth: true,
                      hidden: true,
                      autoheight: true,
                      template: function (obj) {
                        return `
                                                <div class="card">
                                                    <div class="name">Cabang ${obj._id}</div>
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
              },
            ],
          },
        ],
      },
    ],
  });

  // Window: Tambah Cabang
  webix.ui({
    view: "window",
    id: "addBranchWindow",
    width: 800,
    height: 400,
    scroll: "auto",
    position: "center",
    modal: true,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        {
          view: "label",
          label: "Tambah Cabang",
        },
        {
          view: "button",
          label: "Batal",
          id: "btnBatal",
          css: "webix_transparent",
          width: 100,
          click: function () {
            if ($$("addBranchWindow")) $$("addBranchWindow").hide();
          },
        },
      ],
    },
    body: {
      view: "form",
      id: "addBranchForm",
      scroll: "auto",
      elements: [
        {
          cols: [
            {
              rows: [
                {
                  view: "text",
                  id: "vendor_id",
                  name: "vendor_id",
                  label: "Vendor ID",
                  readonly: true,
                  hidden: true,
                },
                {
                  view: "text",
                  id: "_id",
                  name: "_id",
                  label: "Kode Cabang",
                },
                {
                  view: "select",
                  label: "Active Status",
                  id: "activeStatus",
                  name: "activeStatus",
                  options: [
                    { id: "Y", value: "Y" },
                    { id: "T", value: "T" },
                  ],
                },
                {
                  view: "text",
                  id: "BranchName",
                  name: "BranchName",
                  label: "Nama Cabang",
                },
              ],
            },
            { width: 20 },
            {
              rows: [
                {
                  view: "text",
                  id: "location",
                  name: "location",
                  label: "Lokasi",
                },
                {
                  view: "text",
                  id: "address",
                  name: "address",
                  label: "Alamat",
                },
                {
                  view: "text",
                  id: "noTelp",
                  name: "noTelp",
                  label: "No.Telp",
                },
                {
                  view: "text",
                  type: "email",
                  id: "email",
                  name: "email",
                  label: "E-mail",
                },
                { height: 5 },
                {
                  cols: [
                    {},
                    {
                      view: "button",
                      id: "btnClear",
                      label: "Clear",
                      css: "webix_transparent",
                      width: 100,
                      click: function () {
                        if ($$("addBranchForm")) $$("addBranchForm").clear();
                      },
                    },
                    { width: 10 },
                    {
                      view: "button",
                      id: "btnTambahBranch",
                      label: "Tambah",
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
        email: webix.rules.isEmail,
      },
      elementsConfig: {
        labelPosition: "top",
      },
    },
  });

  // Window: Edit Cabang
  webix.ui({
    view: "window",
    id: "editBranchWindow",
    width: 600,
    height: 400,
    scroll: "auto",
    position: "center",
    modal: true,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        {
          view: "label",
          label: "Edit Cabang",
        },
        {
          view: "button",
          label: "Batal",
          css: "webix_transparent",
          width: 100,
          click: function () {
            if ($$("editBranchWindow")) $$("editBranchWindow").hide();
          },
        },
      ],
    },
    body: {
      view: "form",
      id: "editBranchForm",
      scroll: "auto",
      elements: [
        {
          view: "text",
          name: "vendor_id",
          id: "vendor_idEdit",
          label: "Vendor ID",
          readonly: true,
          hidden: true,
        },
        {
          view: "text",
          name: "_id",
          id: "cabang_id",
          label: "Kode Cabang",
          readonly: true,
        },
        {
          view: "select",
          label: "Active Status",
          name: "activeStatus",
          options: [
            { id: "Y", value: "Y" },
            { id: "T", value: "T" },
          ],
        },
        {
          view: "text",
          name: "BranchName",
          label: "Nama Cabang",
        },
        { height: 5 },
        {
          cols: [
            {},
            {
              view: "button",
              label: "Clear",
              id: "btnClearEdit",
              css: "webix_transparent",
              width: 100,
              click: function () {
                if ($$("editBranchForm")) $$("editBranchForm").clear();
              },
            },
            { width: 10 },
            {
              view: "button",
              id: "btnEditBranch2",
              label: "Edit",
              css: "webix_secondary",
              width: 100,
            },
          ],
        },
      ],
      rules: {
        $all: webix.rules.isNotEmpty,
      },
      elementsConfig: {
        labelPosition: "top",
      },
    },
  });
});

webix.ready(function () {
  if ($$("mySidebar")) $$("mySidebar").select("branch");
  if ($$("mySidebar")) {
    $$("mySidebar").filter(function (obj) {
      return obj.id != "user";
    });
  }
  if ($$("btnAdd")) $$("btnAdd").hide();
  if ($$("addBranchForm")) $$("addBranchForm").disable();
  if ($$("editBranchForm")) $$("editBranchForm").disable();
  if ($$("btnAddBranch")) $$("btnAddBranch").hide();
  if ($$("btnEditBranch")) $$("btnEditBranch").hide();
  if ($$("btnDeleteBranch")) $$("btnDeleteBranch").hide();

  if ($$("btnAdd")) {
    $$("btnAdd").attachEvent("onItemClick", function () {
      window.location.href = "/vendor";
    });
  }

  if ($$("btnInfo")) {
    $$("btnInfo").attachEvent("onItemClick", function () {
      let selectedId = $$("vendorDataview")
        ? $$("vendorDataview").getSelectedId()
        : null;
      if (!selectedId) {
        webix.message({
          type: "error",
          text: "Silahkan pilih data Vendor dahulu",
        });
      }
    });
  }

  if ($$("btnAddBranch")) {
    $$("btnAddBranch").attachEvent("onItemClick", function () {
      if ($$("addBranchWindow")) $$("addBranchWindow").show();
      if ($$("addBranchForm")) $$("addBranchForm").clear();
    });
  }

  if ($$("btnTambahBranch")) {
    $$("btnTambahBranch").attachEvent("onItemClick", function () {
      let values = $$("addBranchForm") ? $$("addBranchForm").getValues() : {};
      let message = "Isi Form sesuai dengan ketentuan";
      if ($$("addBranchForm") && $$("addBranchForm").validate()) {
        webix
          .ajax()
          .headers({
            "Content-type": "application/json",
          })
          .post("/branch", JSON.stringify(values), {
            success: function (text, data, xhr) {
              const response = data.json();
              webix.alert({
                title: "Tambah Cabang",
                text: response.message,
                callback: function () {
                  location.reload();
                },
              });
            },
            error: function (text, data, xhr) {
              const response = data.json();
              webix.alert({
                type: "alert-error",
                title: "Tambah Cabang",
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

  if ($$("btnEditBranch")) {
    $$("btnEditBranch").attachEvent("onItemClick", function () {
      let selectedItem = $$("branchDatatable")
        ? $$("branchDatatable").getSelectedItem()
        : null;
      if (selectedItem) {
        if ($$("editBranchWindow")) $$("editBranchWindow").show();
        if ($$("editBranchForm"))
          $$("editBranchForm").setValues(selectedItem, true);

        if ($$("btnEditBranch2")) {
          $$("btnEditBranch2").attachEvent("onItemClick", function () {
            let values = $$("editBranchForm")
              ? $$("editBranchForm").getValues()
              : {};
            let message = "Isi Form sesuai dengan ketentuan";
            if ($$("editBranchForm") && $$("editBranchForm").validate()) {
              webix.confirm({
                type: "confirm-warning",
                title: "Edit Cabang",
                text:
                  "Apakah anda yakin mengedit data cabang " +
                  selectedItem.BranchName +
                  "?",
                ok: "Ya",
                cancel: "Tidak",
                callback: function (result) {
                  if (result) {
                    webix
                      .ajax()
                      .headers({
                        "Content-Type": "application/json",
                      })
                      .put(
                        "/branch/" + selectedItem._id,
                        JSON.stringify(values),
                        {
                          success: function (text, data, xhr) {
                            const response = data.json();
                            webix.alert({
                              title: "Edit Cabang",
                              text: response.message,
                              callback: function () {
                                location.reload();
                              },
                            });
                          },
                          error: function (text, data, xhr) {
                            const response = data.json();
                            webix.alert({
                              type: "alert-error",
                              title: "Edit Cabang",
                              text: response.message,
                            });
                          },
                        },
                      );
                  }
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
      } else {
        webix.message({
          type: "error",
          text: "Silahkan pilih data Cabang dahulu",
        });
      }
    });
  }

  if ($$("btnDeleteBranch")) {
    $$("btnDeleteBranch").attachEvent("onItemClick", function () {
      let selectedItem = $$("branchDatatable")
        ? $$("branchDatatable").getSelectedItem()
        : null;
      if (selectedItem) {
        webix.confirm({
          type: "confirm-error",
          title: "Hapus Cabang",
          text:
            "Apakah Anda yakin ingin menghapus data Cabang " +
            selectedItem.BranchName +
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
                .del("/branch/" + selectedItem._id)
                .then(function (response) {
                  let resJson = response.json();
                  webix.alert({
                    title: "Hapus Cabang",
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
                    title: "Hapus Cabang",
                    text: resJson.message,
                  });
                });
            }
          },
        });
      } else {
        webix.message({
          type: "error",
          text: "Silahkan pilih data Cabang dahulu",
        });
      }
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
        if ($$("mySidebar")) {
          $$("mySidebar").filter(function (obj) {
            return true;
          });
        }
        if ($$("btnAdd")) $$("btnAdd").show();
        if ($$("branchSetup")) $$("branchSetup").show();
        if ($$("addBranchForm")) $$("addBranchForm").enable();
        if ($$("editBranchForm")) $$("editBranchForm").enable();
        if ($$("btnAddBranch")) $$("btnAddBranch").show();
        if ($$("btnEditBranch")) $$("btnEditBranch").show();
        if ($$("btnDeleteBranch")) $$("btnDeleteBranch").show();
      }
    })
    .catch(function (error) {
      console.log("Gagal mendapatkan data", error);
    });
});
