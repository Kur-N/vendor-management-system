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
      const selectedBanks = vendorData.data.accountBank || [];
      const checkboxBank = banks.map((bank) => ({
        view: "checkbox",
        id: `checkbox_${bank._id}`,
        labelRight: bank._id,
        name: bank._id,
        value: selectedBanks.includes(bank._id) ? 1 : 0,
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
            body: {
              rows: [
                {
                  type: "clean",
                  cols: [
                    {
                      height: 60,
                      template: `<h2>Vendor Detail ${vendorData.data.vendorName}</h2>`,
                    },
                    {},
                    {
                      type: "clean",
                      rows: [
                        {},
                        {
                          width: 80,
                          view: "button",
                          value: "Vendor",
                          css: "webix_primary",
                          click: function () {
                            window.location.href = "/vendor";
                          },
                        },
                        {},
                      ],
                    },
                    { width: 10 },
                  ],
                },
                {
                  view: "scrollview",
                  scroll: "y",
                  height: 800,
                  body: {
                    rows: [
                      {
                        view: "form",
                        id: "vendorForm",
                        elements: [
                          {
                            cols: [
                              {
                                rows: [
                                  {
                                    view: "text",
                                    label: "Partner Type",
                                    name: "partnerType",
                                    id: "partnerType",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Vendor Name",
                                    name: "vendorName",
                                    id: "vendorName",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Unit Usaha",
                                    name: "unitUsaha",
                                    id: "unitUsaha",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Address",
                                    name: "address",
                                    id: "address",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Country",
                                    name: "country",
                                    id: "country",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Province",
                                    name: "province",
                                    id: "province",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "No. Telp",
                                    name: "noTelp",
                                    id: "noTelp",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Email Company",
                                    name: "emailCompany",
                                    id: "emailCompany",
                                    readonly: true,
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
                                    id: "namePIC",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Email PIC",
                                    name: "emailPIC",
                                    id: "emailPIC",
                                    readonly: true,
                                  },
                                  {
                                    view: "text",
                                    label: "Position PIC",
                                    name: "positionPIC",
                                    id: "positionPIC",
                                    readonly: true,
                                  },
                                  {
                                    view: "radio",
                                    label: "Active Status",
                                    name: "activeStatus",
                                    id: "activeStatus",
                                    readonly: true,
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
                                        label: "Edit",
                                        id: "btnEdit",
                                        type: "icon",
                                        icon: "mdi mdi-pencil",
                                        css: "webix_secondary",
                                        width: 100,
                                      },
                                      { width: 10 },
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
                      { height: 20 },
                      {
                        view: "toolbar",
                        id: "branchToolbar",
                        elements: [
                          {
                            view: "label",
                            label: "Cabang Vendor",
                          },
                          {},
                          {
                            view: "button",
                            label: "Tambah Cabang",
                            id: "btnAddBranch",
                            css: "webix_primary",
                            width: 180,
                          },
                          {
                            view: "button",
                            label: "Edit Cabang",
                            id: "btnEditBranch",
                            css: "webix_secondary",
                            width: 180,
                          },
                        ],
                      },
                      {
                        view: "datatable",
                        id: "branchDatatable",
                        data: vendorData.data.branchOffice,
                        autoheight: true,
                        scroll: false,
                        select: true,
                        pager: "branchPager",
                        columns: [
                          {
                            id: "index",
                            header: "#",
                            adjust: "data",
                            width: 10,
                          },
                          {
                            id: "branchName",
                            header: "Nama Cabang",
                            adjust: "data",
                            fillspace: 4,
                          },
                          {
                            id: "location",
                            header: "Lokasi",
                            adjust: true,
                            fillspace: 2,
                          },
                          {
                            id: "address",
                            header: "Alamat",
                            adjust: true,
                            fillspace: 5,
                          },
                          {
                            id: "noTelp",
                            header: "No.Telp",
                            adjust: true,
                            fillspace: 2,
                          },
                          {
                            id: "email",
                            header: "Email",
                            adjust: true,
                            fillspace: 3,
                          },
                        ],
                        on: {
                          onBeforeRender: function () {
                            if (this.data.count() === 0) {
                              this.add({ branchName: "Tidak ada data" });
                            }
                          },
                          "data->onStoreUpdated": function () {
                            this.data.each(function (obj, i) {
                              obj.index = i + 1;
                            });
                          },
                          onAfterSelect: function (id) {
                            let selectedItem = this.getItem(id);
                            if ($$("btnUnselectBranch")) {
                              $$("btnUnselectBranch").attachEvent(
                                "onItemClick",
                                function () {
                                  this.detachEvent("onAfterSelect");
                                  selectedItem = null;
                                  if ($$("branchDatatable"))
                                    $$("branchDatatable").unselectAll();
                                },
                              );
                            }
                          },
                        },
                      },
                      {
                        cols: [
                          {
                            view: "pager",
                            id: "branchPager",
                            page: 0,
                            gourp: 3,
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
                      { height: 20 },
                      {
                        view: "toolbar",
                        id: "equipmentToolbar",
                        elements: [
                          {
                            view: "label",
                            label: "Supporting Equipment Vendor",
                          },
                          {},
                          {
                            view: "button",
                            label: "Tambah Barang",
                            id: "btnAddEquipment",
                            css: "webix_primary",
                            width: 180,
                          },
                          {
                            view: "button",
                            label: "Edit Barang",
                            id: "btnEditEquipment",
                            css: "webix_secondary",
                            width: 180,
                          },
                          {
                            view: "button",
                            label: "Hapus Barang",
                            id: "btnDeleteEquipment",
                            css: "webix_danger",
                            width: 180,
                          },
                        ],
                      },
                      {
                        view: "datatable",
                        id: "equipmentDatatable",
                        data: vendorData.data.supportingEquipment,
                        autoheight: true,
                        scroll: false,
                        select: true,
                        pager: "equipmentPager",
                        columns: [
                          {
                            id: "index",
                            header: "#",
                            adjust: "data",
                            width: 10,
                          },
                          {
                            id: "equipmentCode",
                            header: "Kode Equipment",
                            adjust: true,
                            fillspace: 2,
                          },
                          {
                            id: "toolType",
                            header: "Tipe",
                            adjust: true,
                            fillspace: 3,
                          },
                          {
                            id: "count",
                            header: "Jumlah",
                            adjust: true,
                            fillspace: 1,
                          },
                          {
                            id: "merk",
                            header: "Merk",
                            adjust: true,
                            fillspace: 4,
                          },
                          {
                            id: "condition",
                            header: "Kondisi",
                            adjust: true,
                            fillspace: 2,
                          },
                        ],
                        on: {
                          onBeforeRender: function () {
                            if (this.data.count() === 0) {
                              this.add({ equipmentCode: "Tidak ada data" });
                            }
                          },
                          "data->onStoreUpdated": function () {
                            this.data.each(function (obj, i) {
                              obj.index = i + 1;
                            });
                          },
                          onAfterSelect: function (id) {
                            let selectedItem = this.getItem(id);
                            if ($$("btnClearEquipmentForm")) {
                              $$("btnClearEquipmentForm").attachEvent(
                                "onItemClick",
                                function () {
                                  if ($$("equipmentCodeForm"))
                                    $$("equipmentCodeForm").setValue(
                                      selectedItem.equipmentCode,
                                    );
                                },
                              );
                            }
                            if ($$("btnUnselectEquipment")) {
                              $$("btnUnselectEquipment").attachEvent(
                                "onItemClick",
                                function () {
                                  this.detachEvent("onAfterSelect");
                                  selectedItem = null;
                                  if ($$("equipmentDatatable"))
                                    $$("equipmentDatatable").unselectAll();
                                },
                              );
                            }
                          },
                        },
                      },
                      {
                        cols: [
                          {
                            view: "pager",
                            id: "equipmentPager",
                            page: 0,
                            gourp: 3,
                            size: 5,
                            template:
                              "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}",
                          },
                          {},
                          {
                            view: "button",
                            label: "Unselect Barang",
                            id: "btnUnselectEquipment",
                            css: "webix_transparent",
                            width: 180,
                          },
                        ],
                      },
                      { height: 30 },
                      {
                        view: "dataview",
                        id: "vendorChange",
                        scroll: false,
                        select: false,
                        autoWidth: true,
                        height: 250,
                        hidden: true,
                        data: vendorData.data.change,
                        borderless: true,
                        template: function (obj) {
                          return `
                                                    <div class="card">
                                                        <div class="name">Vendor Change</div>
                                                        <div class="info">Create Date: ${obj.createDate}</div>
                                                        <div class="info">Create User: ${obj.createUser}</div>
                                                        <div class="info">Update User: ${obj.updateUser}</div>
                                                        <div class="info">Update Date: ${obj.updateDate}</div>
                                                    </div>
                                                `;
                        },
                        type: {
                          width: 400,
                          height: 200,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
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
  // Window: Add Branch
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
                  name: "location",
                  label: "Lokasi",
                },
                {
                  view: "text",
                  name: "address",
                  label: "Alamat",
                },
                {
                  view: "text",
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
                        if ($$("vendor_id"))
                          $$("vendor_id").setValue(vendorData.data._id);
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

  // Window: Edit Branch
  webix.ui({
    view: "window",
    id: "editBranchWindow",
    width: 600,
    height: 460,
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
          id: "branchName",
          name: "branchName",
          label: "Nama Cabang",
          readonly: true,
        },
        {
          view: "text",
          name: "location",
          label: "Lokasi",
        },
        {
          view: "text",
          name: "address",
          label: "Alamat",
        },
        {
          view: "text",
          name: "noTelp",
          label: "No.Telp",
        },
        {
          view: "text",
          type: "email",
          name: "email",
          label: "E-mail",
        },
        { height: 5 },
        {
          cols: [
            {},
            {
              view: "button",
              label: "Clear",
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
        email: webix.rules.isEmail,
      },
      elementsConfig: {
        labelPosition: "top",
      },
    },
  });

  // Window: Equipment
  webix.ui({
    view: "window",
    id: "equipmentWindow",
    width: 500,
    height: 460,
    scroll: "auto",
    position: "center",
    modal: true,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        {
          view: "label",
          label: "Equipment Form",
        },
        {
          view: "button",
          label: "Batal",
          css: "webix_transparent",
          width: 100,
          click: function () {
            if ($$("equipmentWindow")) $$("equipmentWindow").hide();
          },
        },
      ],
    },
    body: {
      view: "form",
      id: "equipmentForm",
      scroll: "auto",
      elements: [
        {
          view: "text",
          id: "equipmentCodeForm",
          name: "equipmentCode",
          label: "Equipment Code",
          readonly: true,
        },
        {
          view: "text",
          id: "toolTypeForm",
          name: "toolType",
          label: "Tipe",
        },
        {
          view: "counter",
          id: "countForm",
          name: "count",
          label: "Jumlah",
        },
        {
          view: "text",
          name: "merk",
          label: "Merk",
        },
        {
          view: "select",
          name: "condition",
          label: "Kondisi",
          options: [
            { id: "Baru", value: "Baru" },
            { id: "Bekas", value: "Bekas" },
            { id: "Rusak", value: "Rusak" },
          ],
        },
        { height: 5 },
        {
          cols: [
            {},
            {
              view: "button",
              id: "btnClearEquipmentForm",
              label: "Clear",
              css: "webix_transparent",
              width: 100,
              click: function () {
                if ($$("equipmentForm")) $$("equipmentForm").clear();
              },
            },
            { width: 10 },
            {
              view: "button",
              id: "btnEditEquipment2",
              label: "Edit",
              css: "webix_secondary",
              hidden: true,
              width: 100,
            },
            {
              view: "button",
              id: "btnTambahEquipment",
              label: "Tambah",
              css: "webix_secondary",
              hidden: true,
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
  if ($$("mySidebar")) {
    $$("mySidebar").select("vendor");
    $$("mySidebar").filter(function (obj) {
      return obj.id != "user";
    });
  }

  if ($$("vendorForm")) $$("vendorForm").setValues(vendorData.data, true);

  if ($$("btnEdit")) $$("btnEdit").hide();

  // Set readonly to vendorForm elements initially
  const fieldsToLock = [
    "partnerType",
    "vendorName",
    "unitUsaha",
    "address",
    "country",
    "province",
    "noTelp",
    "emailCompany",
    "namePIC",
    "emailPIC",
    "positionPIC",
  ];
  fieldsToLock.forEach((id) => {
    if ($$(id)) {
      $$(id).define("readonly", true);
      $$(id).refresh();
    }
  });

  if ($$("activeStatus")) $$("activeStatus").disable();
  if ($$("bankCheckbox")) $$("bankCheckbox").disable();

  if ($$("addBranchForm")) $$("addBranchForm").disable();
  if ($$("editBranchForm")) $$("editBranchForm").disable();
  if ($$("equipmentForm")) $$("equipmentForm").disable();
  if ($$("btnAddBranch")) $$("btnAddBranch").hide();
  if ($$("btnEditBranch")) $$("btnEditBranch").hide();
  if ($$("btnAddEquipment")) $$("btnAddEquipment").hide();
  if ($$("btnEditEquipment")) $$("btnEditEquipment").hide();
  if ($$("btnDeleteEquipment")) $$("btnDeleteEquipment").hide();

  // Event Handlers for Branch & Equipment Buttons
  if ($$("btnAddBranch")) {
    $$("btnAddBranch").attachEvent("onItemClick", function () {
      if ($$("addBranchWindow")) $$("addBranchWindow").show();
      if ($$("addBranchForm")) $$("addBranchForm").clear();
      if ($$("vendor_id")) $$("vendor_id").setValue(vendorData.data._id);
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
                type: "alert-warning",
                title: "Edit Cabang",
                text:
                  "Apakah Anda yakin ingin mengubah data cabang " +
                  selectedItem.branchName +
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
                      .put(
                        "/vendor-branch/" + vendorData.data._id,
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
          text: "Silahkan pilih data Cabang dahulu",
        });
      }
    });
  }

  if ($$("btnEdit")) {
    $$("btnEdit").attachEvent("onItemClick", function () {
      webix.confirm({
        type: "confirm-warning",
        title: "Update Vendor",
        text: "Apakah anda yakin untuk meng-edit data Vendor?",
        ok: "Ya",
        cancel: "Tidak",
        callback: function (result) {
          if (result) {
            const values = $$("vendorForm") ? $$("vendorForm").getValues() : {};
            const selectedBank = getSelectedBank();
            values.accountBank = selectedBank;

            let message = "Isi semua data Form!";
            if ($$("vendorForm") && $$("vendorForm").validate()) {
              webix
                .ajax()
                .headers({
                  "Content-type": "application/json",
                })
                .put("/vendor/" + vendorData.data._id, JSON.stringify(values), {
                  success: function (text, data, xhr) {
                    let response = data.json();
                    webix.alert({
                      title: "Update Vendor",
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
                      title: "Update Vendor",
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
          }
        },
      });
    });
  }

  if ($$("btnAddEquipment")) {
    $$("btnAddEquipment").attachEvent("onItemClick", function () {
      if ($$("equipmentWindow")) $$("equipmentWindow").show();
      if ($$("btnTambahEquipment")) $$("btnTambahEquipment").show();
      if ($$("btnEditEquipment2")) $$("btnEditEquipment2").hide();
      if ($$("equipmentForm")) $$("equipmentForm").clear();
      if ($$("equipmentCodeForm")) {
        $$("equipmentCodeForm").define("readonly", false);
        $$("equipmentCodeForm").refresh();
      }
    });
  }

  if ($$("btnTambahEquipment")) {
    $$("btnTambahEquipment").attachEvent("onItemClick", function () {
      let values = $$("equipmentForm") ? $$("equipmentForm").getValues() : {};
      let message = "Isi Equipment Form sesuai ketentuan";
      if ($$("equipmentForm") && $$("equipmentForm").validate()) {
        webix
          .ajax()
          .headers({
            "Content-type": "application/json",
          })
          .post(
            "/vendor-equipment/" + vendorData.data._id,
            JSON.stringify(values),
            {
              success: function (text, data, xhr) {
                const response = data.json();
                webix.alert({
                  title: "Tambah Equipment",
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
                  title: "Tambah Equipment",
                  text: response.message,
                });
              },
            },
          );
      } else {
        webix.message({
          type: "error",
          text: message,
        });
      }
    });
  }

  if ($$("btnEditEquipment")) {
    $$("btnEditEquipment").attachEvent("onItemClick", function () {
      let selectedItem = $$("equipmentDatatable")
        ? $$("equipmentDatatable").getSelectedItem()
        : null;
      if (selectedItem) {
        if ($$("equipmentWindow")) $$("equipmentWindow").show();
        if ($$("btnTambahEquipment")) $$("btnTambahEquipment").hide();
        if ($$("btnEditEquipment2")) $$("btnEditEquipment2").show();
        if ($$("equipmentForm"))
          $$("equipmentForm").setValues(selectedItem, true);
        if ($$("equipmentCodeForm")) {
          $$("equipmentCodeForm").define("readonly", true);
          $$("equipmentCodeForm").refresh();
        }

        if ($$("btnEditEquipment2")) {
          $$("btnEditEquipment2").attachEvent("onItemClick", function () {
            let values = $$("equipmentForm")
              ? $$("equipmentForm").getValues()
              : {};
            let message = "Isi Equipment Form sesuai ketentuan";
            if ($$("equipmentForm") && $$("equipmentForm").validate()) {
              webix.confirm({
                type: "confirm-warning",
                title: "Edit Equipment",
                text:
                  "Apakah anda yakin mengedit data equipment " +
                  selectedItem.equipmentCode +
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
                        "/vendor-equipment/" + vendorData.data._id,
                        JSON.stringify(values),
                        {
                          success: function (text, data, xhr) {
                            const response = data.json();
                            webix.alert({
                              title: "Edit Equipment",
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
                              title: "Edit Equipment",
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
          text: "Silahkan pilih data Equipment dahulu",
        });
      }
    });
  }

  if ($$("btnDeleteEquipment")) {
    $$("btnDeleteEquipment").attachEvent("onItemClick", function () {
      let selectedItem = $$("equipmentDatatable")
        ? $$("equipmentDatatable").getSelectedItem()
        : null;
      if (selectedItem) {
        webix.confirm({
          type: "confirm-error",
          title: "Delete Equipment",
          text:
            "Apakah Anda yakin ingin menghapus data Equipment " +
            selectedItem.equipmentCode +
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
                .del(
                  "/vendor-equipment/" + vendorData.data._id,
                  JSON.stringify({ equipmentCode: selectedItem.equipmentCode }),
                )
                .then(function (response) {
                  let resJson = response.json();
                  webix.alert({
                    title: "Hapus Equipment",
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
          text: "Silahkan pilih data Equipment dahulu",
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
        if ($$("vendorChange")) $$("vendorChange").show();
        if ($$("btnEdit")) $$("btnEdit").show();
        if ($$("bankCheckbox")) $$("bankCheckbox").enable();

        fieldsToLock.forEach((id) => {
          if ($$(id)) {
            $$(id).define("readonly", false);
            $$(id).refresh();
          }
        });

        if ($$("activeStatus")) $$("activeStatus").enable();
        if ($$("addBranchForm")) $$("addBranchForm").enable();
        if ($$("editBranchForm")) $$("editBranchForm").enable();
        if ($$("equipmentForm")) $$("equipmentForm").enable();
        if ($$("btnAddBranch")) $$("btnAddBranch").show();
        if ($$("btnEditBranch")) $$("btnEditBranch").show();
        if ($$("btnAddEquipment")) $$("btnAddEquipment").show();
        if ($$("btnEditEquipment")) $$("btnEditEquipment").show();
        if ($$("btnDeleteEquipment")) $$("btnDeleteEquipment").show();

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
