webix.ready(function () {
  webix.ui({
    type: "space",
    rows: [
      {
        align: "middle,center",
        body: {
          id: "loginForm",
          view: "form",
          scroll: false,
          width: 350,
          elements: [
            {
              view: "label",
              label: "Login VMS",
              align: "center",
            },
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
              type: "password",
              label: "Password",
              id: "password",
              name: "password",
              invalidMessage: "Password cannot be empty",
              placeholder: "Enter your password",
              clear: true,
            },
            {
              view: "button",
              id: "btnLogin",
              value: "Login",
              css: "webix_primary",
            },
            {
              view: "button",
              id: "btnRegister",
              value: "SignUp",
              css: "webix_secondary",
              click: function () {
                window.location.href = "/register";
              },
            },
            {
              view: "template",
              template: "<div class='forgot-password'>Lupa Password?</div>",
              autoheight: true,
              css: "clickable-link right-align",
              onClick: {
                "forgot-password": function () {
                  $$("newPassword").hide();
                  $$("repeatNewPassword").hide();
                  $$("btnChangePassword").hide();
                  $$("btnCheckUsername").show();
                  $$("forgotPasswordWindow").show();
                  $$("forgotPasswordForm").clear();
                  $$("checkUsername").define("readonly", false);
                  $$("checkUsername").refresh();
                },
              },
            },
          ],
          rules: {
            $all: webix.rules.isNotEmpty,
          },
          elementsConfig: {
            labelPosition: "top",
            labelWidth: 140,
          },
        },
      },
    ],
  });
});

webix.ready(function () {
  webix.ui({
    view: "window",
    id: "forgotPasswordWindow",
    height: 500,
    width: 500,
    position: "center",
    head: "Forgot Password",
    modal: true,
    close: true,
    body: {
      view: "form",
      id: "forgotPasswordForm",
      elements: [
        {
          view: "text",
          label: "Username",
          id: "checkUsername",
          name: "checkUsername",
          invalidMessage: "Username cannot be empty",
          placeholder: "Enter your username",
          clear: true,
        },
        {
          view: "button",
          id: "btnCheckUsername",
          value: "Cek Username",
          css: "webix_primary",
        },
        {
          view: "text",
          label: "Password",
          type: "password",
          id: "newPassword",
          name: "newPassword",
          invalidMessage: "Password cannot be empty",
          placeholder: "Enter your new password",
          clear: true,
          hidden: true,
        },
        {
          view: "text",
          label: "Repeat Password",
          type: "password",
          id: "repeatNewPassword",
          name: "repeatNewPassword",
          invalidMessage: "Repeat Password cannot be empty",
          placeholder: "Re-enter your new password",
          clear: true,
          hidden: true,
        },
        {
          view: "button",
          id: "btnChangePassword",
          value: "Change Password",
          css: "webix_primary",
          hidden: true,
        },
      ],
      rules: {
        $all: webix.rules.isNotEmpty,
      },
      elementsConfig: {
        labelPosition: "top",
        labelWidth: 140,
      },
    },
    on: {
      onClose: function () {
        $$("newPassword").hide();
        $$("repeatNewPassword").hide();
        $$("btnChangePassword").hide();
        $$("btnCheckUsername").show();
        $$("forgotPasswordForm").clear();
      },
    },
  });
});

webix.ready(function () {
  if ($$("btnLogin")) {
    $$("btnLogin").attachEvent("onItemClick", function () {
      let values = $$("loginForm").getValues();
      if ($$("loginForm").validate()) {
        webix
          .ajax()
          .headers({
            "Content-type": "application/json",
          })
          .post("/login", JSON.stringify(values), {
            success: function (text, data, xhr) {
              let response = data.json();
              let message = response.message;
              webix.alert({
                title: "Login",
                text: "Login successful! Redirecting you to your dashboard…",
                callback: function () {
                  window.location.href = response.url;
                },
              });
            },
            error: function (text, data, xhr) {
              let response = data.json();
              let message = response.message;
              webix.message({
                type: "error",
                text: message,
                expire: 5000,
              });
            },
          });
      }
    });
  }

  if ($$("btnCheckUsername")) {
    $$("btnCheckUsername").attachEvent("onItemClick", function () {
      let values = $$("forgotPasswordForm").getValues();
      if ($$("forgotPasswordForm").validate()) {
        webix
          .ajax()
          .headers({
            "Content-type": "application/json",
          })
          .post("/forgot-password", JSON.stringify(values), {
            success: function (text, data, xhr) {
              let response = data.json();
              let message = response.message;
              webix.alert({
                title: "Check Username",
                text: message,
              });
              $$("btnCheckUsername").hide();
              $$("newPassword").show();
              $$("repeatNewPassword").show();
              $$("btnChangePassword").show();
              $$("checkUsername").define("readonly", true);
              $$("checkUsername").refresh();
            },
            error: function (text, data, xhr) {
              let response = data.json();
              let message = response.message;
              webix.alert({
                type: "alert-error",
                title: "Check Username",
                text: message,
              });
            },
          });
      }
    });
  }

  if ($$("btnChangePassword")) {
    $$("btnChangePassword").attachEvent("onItemClick", function () {
      let values = $$("forgotPasswordForm").getValues();
      if ($$("forgotPasswordForm").validate()) {
        let newPassword = values.newPassword;
        let repeatPassword = values.repeatNewPassword;

        if (!newPassword || !repeatPassword) {
          webix.alert({
            type: "alert-error",
            title: "Error",
            text: "Password fields cannot be empty",
          });
          return false;
        }
        if (newPassword !== repeatPassword) {
          webix.alert({
            type: "alert-error",
            title: "Error",
            text: "Passwords are not the same",
          });
          return false;
        }
        webix.confirm({
          type: "confirm-warning",
          title: "Confirm",
          text: "Are you sure to change your password?",
          ok: "Yes",
          cancel: "No",
          callback: function (result) {
            if (result) {
              webix
                .ajax()
                .headers({
                  "Content-type": "application/json",
                })
                .put("/forgot-password", JSON.stringify(values), {
                  success: function (text, data, xhr) {
                    let response = data.json();
                    let message = response.message;
                    webix.alert({
                      title: "Change Password",
                      text: message,
                      callback: function () {
                        window.location.href = response.url;
                      },
                    });
                  },
                  error: function (text, data, xhr) {
                    let response = data.json();
                    let message = response.message;
                    webix.alert({
                      type: "alert-error",
                      title: "Change Password",
                      text: message,
                    });
                  },
                });
            }
          },
        });
      }
    });
  }
});
