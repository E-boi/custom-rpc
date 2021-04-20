const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const Settings = require('./Settings');

module.exports = class customRPC extends Plugin {
	reloadRPC() {
		const { SET_ACTIVITY } = getModule(['INVITE_BROWSER'], false);
		SET_ACTIVITY.handler({
			socket: {
				id: 100,
				application: {
					id: this.settings.get('client_id', '711416957718757418'),
					name: this.settings.get('name', 'testing lol'),
				},
				transport: 'ipc',
			},
			args: {
				pid: 10,
				activity: this.game(),
			},
		});
	}

	game() {
		return {
			details: this.settings.get('details', 'Browsing Discord'),
			state: this.settings.get('state', 'Powercord Client'),
			timestamps: this.settings.get('show_time', true)
				? {
						start: Date.now(),
				  }
				: undefined,
			assets: {
				large_image: this.settings.get('large_image', undefined),
				small_image: this.settings.get('small_image', undefined),
				large_text: this.settings.get('large_text', undefined) || undefined,
				small_text: this.settings.get('small_text', undefined) || undefined,
			},
		};
	}

	startPlugin() {
		this.reloadRPC = this.reloadRPC; // this will be used in settings to reload
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Custom RPC',
			render: props =>
				React.createElement(Settings, {
					reloadRPC: this.reloadRPC,
					...props,
				}),
		});

		const { SET_ACTIVITY } = getModule(['INVITE_BROWSER'], false);
		// without it sometimes the rpc wouldn't show
		setTimeout(() => {
			SET_ACTIVITY.handler({
				socket: {
					id: 100,
					application: {
						id: this.settings.get('client_id', '711416957718757418'),
						name: this.settings.get('name', 'testing lol'),
					},
					transport: 'ipc',
				},
				args: {
					pid: 10,
					activity: this.game(),
				},
			});
		}, 5000);
	}

	pluginWillUnload() {
		const { SET_ACTIVITY } = getModule(['INVITE_BROWSER'], false);
		SET_ACTIVITY.handler({
			socket: {
				id: 100,
				application: {
					id: this.settings.get('client_id', '711416957718757418'),
					name: this.settings.get('name', 'testing lol'),
				},
				transport: 'ipc',
			},
			args: {
				pid: 10,
				activity: undefined,
			},
		});
		powercord.api.settings.unregisterSettings(this.entityID);
	}
};
