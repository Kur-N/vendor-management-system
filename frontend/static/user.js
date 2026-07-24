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
                if (id != "user") {
                  window.location.href = url;
                }
              },
            },
          },
          {
            type: "clean",
            rows: [
              {
                template: "<h2>User</h2>",
                height: 50,
              },
              {
                view: "toolbar",
                elements: [
                  {
                    view: "button",
                    id: "btnUnselect",
                    label: "Unselect",
                    css: "webix_transparent",
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
                  {
                    view: "button",
                    id: "btnAddUser",
                    label: "Tambah User",
                    css: "webix_primary",
                    width: 140,
                  },
                  {
                    view: "button",
                    id: "btnEditUser",
                    label: "Edit User",
                    css: "webix_secondary",
                    width: 140,
                  },
                  {
                    view: "button",
                    id: "btnDeleteUser",
                    label: "Delete User",
                    css: "webix_danger",
                    width: 140,
                  },
                  { width: 20 },
                ],
              },
              {
                view: "datatable",
                id: "userDatatable",
                pager: "myPager",
                scroll: false,
                select: true,
                data: userData.data,
                columns: [
                  { id: "index", header: "#", adjust: "data", width: 10 },
                  {
                    id: "username",
                    header: "Username",
                    adjust: true,
                    fillspace: 1,
                  },
                  { id: "email", header: "E-mail", adjust: true, fillspace: 2 },
                  { id: "role", header: "Role", adjust: true, fillspace: 1 },
                ],
                on: {
                  onBeforeRender: function () {
                    if (this.data.count() === 0) {
                      this.add({ branch_id: "Tidak ada data" });
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
                    if ($$("btnUnselect")) {
                      $$("btnUnselect").attachEvent("onItemClick", function () {
                        this.detachEvent("onAfterSelect");
                        selectedId = null;
                        selectedItem = null;
                        if ($$("userDatatable"))
                          $$("userDatatable").unselectAll();
                      });
                    }
                  },
                },
              },
              {},
            ],
          },
        ],
      },
    ],
  });
});

webix.ready(function () {
  // Window: Add User
  webix.ui({
    view: "window",
    id: "addUserWindow",
    width: 400,
    height: 500,
    scroll: "auto",
    position: "center",
    modal: true,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        {
          view: "label",
          label: "Tambah User",
        },
        {
          view: "button",
          label: "Batal",
          id: "btnBatal",
          css: "webix_transparent",
          width: 100,
          click: function () {
            if ($$("addUserWindow")) $$("addUserWindow").hide();
          },
        },
      ],
    },
    body: {
      view: "form",
      id: "addUserForm",
      elements: [
        {
          view: "text",
          label: "Username",
          id: "username",
          name: "username",
          invalidMessage: "Username cannot be empty",
          placeholder: "Enter your username",
          clear: true,
        },
        {
          view: "text",
          type: "email",
          label: "E-mail",
          id: "email",
          name: "email",
          invalidMessage: "Incorrect email address",
          placeholder: "Enter your email",
          clear: true,
        },
        {
          view: "text",
          type: "password",
          label: "Password",
          id: "password",
          name: "password",
          invalidMessage: "Password cannot be empty",
          placeholder: "Enter your password",
          relatedView: "repeatPassword",
          relatedAction: "enable",
          clear: true,
        },
        {
          view: "text",
          type: "password",
          label: "Repeat Password",
          id: "repeatPassword",
          name: "repeatPassword",
          invalidMessage: "Repeat Password cannot be empty",
          placeholder: "Repeat your password",
          disabled: true,
          clear: true,
        },
        {
          view: "select",
          label: "Role",
          id: "role",
          name: "role",
          options: [
            { id: "user", value: "User" },
            { id: "admin", value: "Admin" },
          ],
        },
        { height: 5 },
        {
          cols: [
            {},
            {
              view: "button",
              id: "btnClearAddUser",
              label: "Clear",
              css: "webix_transparent",
              width: 100,
              click: function () {
                if ($$("addUserForm")) $$("addUserForm").clear();
              },
            },
            { width: 10 },
            {
              view: "button",
              id: "btnAddUser2",
              label: "Tambah",
              css: "webix_primary",
              width: 100,
            },
          ],
        },
      ],
      rules: {
        $all: webix.rules.isNotEmpty,
        $obj: function (data) {
          if (!data.password || !data.repeatPassword) {
            return false;
          }
          if (data.password !== data.repeatPassword) {
            webix.alert({
              type: "alert-error",
              title: "Error",
              text: "Passwords are not the same",
            });
            return false;
          }
          return true;
        },
        email: webix.rules.isEmail,
      },
      elementsConfig: {
        labelPosition: "top",
        labelWidth: 140,
      },
    },
  });

  // Window: Edit User
  webix.ui({
    view: "window",
    id: "editUserWindow",
    width: 400,
    height: 500,
    scroll: "auto",
    position: "center",
    modal: true,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        {
          view: "label",
          label: "Edit User",
        },
        {
          view: "button",
          label: "Batal",
          id: "btnBatalEdit",
          css: "webix_transparent",
          width: 100,
          click: function () {
            if ($$("editUserWindow")) $$("editUserWindow").hide();
          },
        },
      ],
    },
    body: {
      view: "form",
      id: "editUserForm",
      elements: [
        {
          view: "text",
          label: "Username",
          id: "editUsername",
          name: "username",
          invalidMessage: "Username cannot be empty",
          placeholder: "Enter your username",
          clear: true,
        },
        {
          view: "text",
          type: "email",
          label: "E-mail",
          id: "editEmail",
          name: "email",
          invalidMessage: "Incorrect email address",
          placeholder: "Enter your email",
          clear: true,
        },
        {
          view: "select",
          label: "Role",
          id: "editRole",
          name: "role",
          options: [
            { id: "user", value: "User" },
            { id: "admin", value: "Admin" },
          ],
        },
        { height: 5 },
        {
          cols: [
            {},
            {
              view: "button",
              id: "btnClearEditUser",
              label: "Clear",
              css: "webix_transparent",
              width: 100,
              click: function () {
                if ($$("editUserForm")) $$("editUserForm").clear();
              },
            },
            { width: 10 },
            {
              view: "button",
              id: "btnEditUser2",
              label: "Edit",
              css: "webix_secondary",
              width: 100,
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
        labelWidth: 140,
      },
    },
  });
});

webix.ready(function () {
  if ($$("mySidebar")) {
    $$("mySidebar").filter(function (obj) {
      return obj.id != "user";
    });
    $$("mySidebar").select("user");
  }

  if ($$("btnAddUser")) {
    $$("btnAddUser").attachEvent("onItemClick", function () {
      if ($$("addUserWindow")) $$("addUserWindow").show();
      if ($$("addUserForm")) $$("addUserForm").clear();
    });
  }

  if ($$("btnAddUser2")) {
    $$("btnAddUser2").attachEvent("onItemClick", function () {
      let values = $$("addUserForm") ? $$("addUserForm").getValues() : {};
      if ($$("addUserForm") && $$("addUserForm").validate()) {
        webix
          .ajax()
          .headers({
            "Content-Type": "application/json",
          })
          .post("/user", JSON.stringify(values), {
            success: function (text, data, xhr) {
              const response = data.json();
              webix.alert({
                title: "Tambah User",
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
                title: "Tambah User",
                text: response.message,
              });
            },
          });
      }
    });
  }

  if ($$("btnEditUser")) {
    $$("btnEditUser").attachEvent("onItemClick", function () {
      let selectedItem = $$("userDatatable")
        ? $$("userDatatable").getSelectedItem()
        : null;
      if (!selectedItem) {
        webix.message({
          type: "error",
          text: "Silahkan pilih data User dahulu",
        });
      } else {
        if ($$("editUserWindow")) $$("editUserWindow").show();
        if ($$("editUserForm"))
          $$("editUserForm").setValues(selectedItem, true);

        if ($$("btnEditUser2")) {
          $$("btnEditUser2").attachEvent("onItemClick", function () {
            let values = $$("editUserForm")
              ? $$("editUserForm").getValues()
              : {};
            if ($$("editUserForm") && $$("editUserForm").validate()) {
              webix.confirm({
                type: "confirm-warning",
                title: "Edit User",
                text:
                  "Apakah Anda yakin ingin mengubah data user " +
                  selectedItem.username +
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
                        "/user/" + selectedItem._id,
                        JSON.stringify(values),
                        {
                          success: function (text, data, xhr) {
                            const response = data.json();
                            webix.alert({
                              title: "Edit User",
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
                              title: "Edit User",
                              text: response.message,
                            });
                          },
                        },
                      );
                  }
                },
              });
            }
          });
        }
      }
    });
  }

  if ($$("btnDeleteUser")) {
    $$("btnDeleteUser").attachEvent("onItemClick", function () {
      let selectedItem = $$("userDatatable")
        ? $$("userDatatable").getSelectedItem()
        : null;
      if (!selectedItem) {
        webix.message({
          type: "error",
          text: "Silahkan pilih data User dahulu",
        });
      } else {
        webix.confirm({
          type: "confirm-error",
          title: "Hapus User",
          text:
            "Apakah Anda yakin ingin menghapus user " +
            selectedItem.username +
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
                .del("/user/" + selectedItem._id)
                .then(function (response) {
                  let resJson = response.json();
                  webix.alert({
                    title: "Hapus User",
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
                    title: "Hapus User",
                    text: resJson.message,
                  });
                });
            }
          },
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
      }
    })
    .catch(function (error) {
      console.log("Gagal mendapatkan data", error);
    });
});
