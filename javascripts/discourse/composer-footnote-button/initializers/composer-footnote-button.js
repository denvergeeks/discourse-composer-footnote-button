import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "composer-footnote-button",

  initialize() {
    withPluginApi("0.8", (api) => {   
      const currentLocale = I18n.currentLocale();
      if (!I18n.translations[currentLocale].js.composer) {
        I18n.translations[currentLocale].js.composer = {};
      }
      
      I18n.translations[currentLocale].js.footnote_button_title = I18n.t(themePrefix("composer_footnote_button_title"));
      I18n.translations[currentLocale].js.composer.footnote_button_text = I18n.t(themePrefix("composer_footnote_button_text"));
      
      api.modifyClass("controller:composer", {
        pluginId: "FootnoteButton",

        actions: {
          footnoteButton() {
            this.get("toolbarEvent").applySurround(
              '^[',
              "]",
              "footnote_button_text",
              { multiline: false }
            );
          },
        },
      });
      
      if (settings.put_in_popup_menu) {
        api.addToolbarPopupMenuOption((controller) => {
          return {
            action: "footnoteButton",
            icon: settings.composer_footnote_button_icon,
            label: "footnote_button_title",
          };
        });
      } else {
        api.onToolbarCreate(function(toolbar) {
          toolbar.addButton({
            trimLeading: true,
            id: "quick-footnote",
            group: settings.composer_footnote_button_group,
            icon: settings.composer_footnote_button_icon,
            title: "footnote_button_title",
            perform: function(e) {
              return e.applySurround(
                '^[',
                "]",
                "footnote_button_text",
                { multiline: false }
              );
            }
          });
        });
      }
    });
  },
};
