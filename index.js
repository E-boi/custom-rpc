const { Plugin } = require("powercord/entities");
const Settings = require('./Settings.jsx');

module.exports = class LightcordRPC extends Plugin {
    async startPlugin () {
        let dispatcher = require("powercord/webpack").FluxDispatcher;
        let ActionTypes = require("powercord/webpack").constants.ActionTypes;

        let socketId = "lightcord-rpc-socket"
        let pid = require("electron").remote.getCurrentWebContents().getProcessId()

        class CustomRichPresence {
            constructor(context){
                this.enabled = false
        
                this.game = {
                    "name": context.settings.get("rpcName","Lightcord RPC"),
                    "application_id": context.settings.get("rpcId","711416957718757418"),
                    "state": context.settings.get("rpcState","Powercord Client"),
                    "details": context.settings.get("rpcDetails","Browsing Discord"),
                    "timestamps.start": Date.now(),
                    "assets.small": context.settings.get("rpcSmallAsset",null),
                    "assets.large": context.settings.get("rpcLargeAsset","757229873071784046")
                }

                this.context = context;
            }
            
            get formatedGame(){
                if(!this.game)return null
                if(this.enabled === false)return null
                let game = {
                    name: this.game.name || defaultRPC.name,
                    application_id: this.game.application_id || defaultRPC.application_id,
                    details: this.game.details || undefined,
                    state: this.game.state || undefined,
                    timestamps: this.game["timestamps.start"] ? {
                        start: this.game["timestamps.start"]
                    } : undefined,
                    assets: this.game["assets.large"] ? {
                        large_image: this.game["assets.large"],
                        small_image: this.game["assets.small"] || undefined
                    } : undefined
                }
                return game
            }
        
            sendGame(){
                dispatcher.dispatch({
                    type: ActionTypes.LOCAL_ACTIVITY_UPDATE,
                    socketId,
                    pid,
                    activity: this.formatedGame
                })   
            }
        
            async enable(silent) {
                if(this.enabled)return
                this.enabled = true
        
                await this.set({
                    "name": this.context.settings.get("rpcName","Lightcord RPC"),
                    "application_id": this.context.settings.get("rpcId","711416957718757418"),
                    "state": this.context.settings.get("rpcState","Powercord Client"),
                    "details": this.context.settings.get("rpcDetails","Browsing Discord"),
                    "timestamps.start": Date.now(),
                    "assets.small": this.context.settings.get("rpcSmallAsset",null),
                    "assets.large": this.context.settings.get("rpcLargeAsset","757229873071784046")
                })
        
                await this.sendGame()
        
                if(!silent) {
                    powercord.api.notices.sendToast("lc-rpc-on", {
                        header: "Lightcord RPC", 
                        content: "Lightcord RPC has been enabled",
                        type: "info",
                        timeout: 10e2
                    });
                }
            }
        
            async disable(silent) {
                if(!this.enabled)return
                this.enabled = false
        
                await this.sendGame()
        
                if(!silent) {
                    powercord.api.notices.sendToast("lc-rpc-off", {
                        header: "Lightcord RPC", 
                        content: "Lightcord RPC has been disabled",
                        type: "info",
                        timeout: 10e2
                    });
                }
            }

            async refresh(silent) {
                await this.disable(true);
                await this.enable(true);

                if(!silent) {
                    powercord.api.notices.sendToast("lc-rpc-refresh", {
                        header: "Lightcord RPC", 
                        content: "Lightcord RPC has been refreshed",
                        type: "info",
                        timeout: 10e2
                    });
                }
            }
        
            async fetchAssets(applicationId){
                let assets = await require("powercord/webpack").getModule(["getAssets"]).getAssets(applicationId)
                if(assets.undefined && typeof assets.undefined === "number"){
                    powercord.api.notices.sendToast("lc-rpc-err", {
                        header: "Lightcord RPC", 
                        content: "Invalid application ID",
                        type: "error",
                        timeout: 10e3
                    });
                    throw new Error("Unknown Application")
                }
                return assets
            }
        
            set(activity){
                this.game = activity
        
                this.sendGame()
            }
        }

        this.rpcClass = CustomRichPresence;
        this.rpc = new this.rpcClass(this);

        if(this.settings.get("rpcEnabled",true)) {
            await this.rpc.enable(true);
        }
        powercord.api.settings.registerSettings("lc-rpc-settings", {
            category: "lc-rpc",
            label: "Lightcord RPC",
            render: Settings
        });
    }

    async pluginWillUnload () {
        await this.rpc.disable();
        powercord.api.settings.unregisterSettings("lc-rpc-settings");
    }
};
