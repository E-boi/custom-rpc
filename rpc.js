let pid = require("electron").remote.getCurrentWebContents().getProcessId()

module.exports = class CustomRichPresence {
    constructor(){
        this.enabled = false

        this.game = getRPC();
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

    async enable() {
        if(this.enabled)return
        this.enabled = true

        await this.set(getRPC())

        await this.sendGame()

        powercord.api.notices.sendToast("lc-rpc-on", {
            header: "Lightcord RPC", 
            content: "Lightcord RPC has been enabled",
            type: "info",
            timeout: 10e2
        });
    }

    async disable() {
        if(!this.enabled)return
        this.enabled = false

        await this.sendGame()

        powercord.api.notices.sendToast("lc-rpc-off", {
            header: "Lightcord RPC", 
            content: "Lightcord RPC has been disabled",
            type: "info",
            timeout: 10e2
        });
    }

    async refresh() {
        await this.sendGame()

        powercord.api.notices.sendToast("lc-rpc-refresh", {
            header: "Lightcord RPC", 
            content: "Lightcord RPC has been refreshed",
            type: "info",
            timeout: 10e2
        });
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