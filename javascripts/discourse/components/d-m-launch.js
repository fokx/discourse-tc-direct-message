import Component from "@glimmer/component";
import {tracked} from "@glimmer/tracking";
import {action} from "@ember/object";
import {inject as service} from "@ember/service";
import {ajax} from "discourse/lib/ajax";
import DiscourseURL from "discourse/lib/url";
import {defaultHomepage} from "discourse/lib/utilities";
import Composer from "discourse/models/composer";
import User from "discourse/models/user";
import I18n from "I18n";

export default class ContentLanguageDiscovery extends Component {
    @service siteSettings;
    @service currentUser;
    @service chat;
    @service router;
    @service composer;

    @tracked botUser = null;

    get showDMButton() {
        const {currentRouteName} = this.router;
        return (
            this.currentUser &&
            currentRouteName === `discovery.${defaultHomepage()}`
        );
    }

    @action
    getBotUser() {
        User.findByUsername(settings.DM_username, {}).then((user) => {
            this.botUser = user;
        });
    }


    get DMLaunchIcon() {
        return settings.DM_btn_icon;
    }

    get DM_btn_text() {
        if (settings.DM_fixed_btn_text) {
            return settings.DM_fixed_btn_text;
        } else{
            return settings.DM_btn_text + " " + settings.DM_username;
        }
    }

    @action
    async startChatting() {
        let result = {};
        this.chat
            .upsertDmChannel({
                usernames: [
                    settings.DM_username,
                    this.currentUser.username,
                ],
            })
            .then((chatChannel) => {
                this.router.transitionTo("chat.channel", ...chatChannel.routeModels);
            });
    }
}
