const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const Settings = require('./Settings');

const defaults = {
	show_time: true,
	client_id: '711416957718757418',
	name: 'Custom RPC',
	state: 'Powercord client',
	details: 'Browsing Discord',
	large_image: 'powercord',
	small_image: 'powercord',
	button1: {
		label: 'powercord.dev',
		url: 'https://powercord.dev/',
	},
};

module.exports = class customRPC extends Plugin {
	reloadRPC() {
		const selectedRPC = this.settings.get('selected', 'rpc1');
		const { SET_ACTIVITY } = getModule(['INVITE_BROWSER'], false);
		SET_ACTIVITY.handler({
			socket: {
				id: 100,
				application: {
					id: this.settings.get(`${selectedRPC}.client_id`, '711416957718757418'),
					name: this.settings.get(`${selectedRPC}.name`, 'Custom RPC'),
				},
				transport: 'ipc',
			},
			args: {
				pid: 10,
				activity: this.game(),
			},
		});
	}

	convertSettingsForConfigs() {
		if (this.settings.get('rpc1', undefined)) return;
		const settings = powercord.api.settings._fluxProps(__dirname.split('/').pop()).settings;
		if (Object.entries(settings).length === 0) {
			console.log('setting defaults...');
			this.settings.set('rpc1', defaults);
			this.settings.set('rpc2', defaults);
			this.settings.set('rpc3', defaults);
			return;
		}
		const rpc1 = {
			show_time: settings.show_time || defaults.show_time,
			client_id: settings.client_id || defaults.client_id,
			name: settings.name || defaults.name,
			state: settings.state || defaults.state,
			details: settings.details || defaults.details,
			large_image: settings.large_image || defaults.large_image,
			small_image: settings.small_image || defaults.small_image,
			button1: {
				label: settings.button1?.label ?? defaults.button1.label,
				url: settings.button1?.url ?? defaults.button1.url,
			},
		};
		if (settings.button2) rpc1.button2 = settings.button2;
		if (settings.start_time) rpc1.start_time = settings.start_time;
		if (settings.large_text) rpc1.large_text = settings.large_text;
		if (settings.small_text) rpc1.small_text = settings.small_text;
		for (const setting of Object.entries(settings)) this.settings.delete(setting[0]);
		this.settings.set('rpc1', rpc1);
		this.settings.set('rpc2', defaults);
		this.settings.set('rpc3', defaults);
	}

	game() {
		const selectedRPC = this.settings.get('selected', 'rpc1');
		let rp = {
			details: this.settings.get(`${selectedRPC}.details`, 'Browsing Discord'),
			state: this.settings.get(`${selectedRPC}.state`, 'Powercord Client'),
			timestamps: this.settings.get(`${selectedRPC}.show_time`, true)
				? {
						start: this.settings.get(`${selectedRPC}.start_time`, undefined)
							? new Date(new Date().getTime() - this.settings.get(`${selectedRPC}.start_time`, undefined) * 60000).getTime()
							: Date.now(),
				  }
				: undefined,
			assets: {
				large_image: this.settings.get(`${selectedRPC}.large_image`, 'powercord'),
				small_image: this.settings.get(`${selectedRPC}.small_image`, 'powercord'),
				large_text: this.settings.get(`${selectedRPC}.large_text`, undefined) || undefined,
				small_text: this.settings.get(`${selectedRPC}.small_text`, undefined) || undefined,
			},
		};

		let buttons = [];
		if (
			this.settings.get(`${selectedRPC}.button1`, { label: 'powercord.dev', url: 'https://powercord.dev' }).label != '' &&
			this.settings.get(`${selectedRPC}.button1`, { label: 'powercord.dev', url: 'https://powercord.dev' }).url != ''
		)
			buttons.push(this.settings.get(`${selectedRPC}.button1`, { label: 'powercord.dev', url: 'https://powercord.dev' }));
		if (
			this.settings.get(`${selectedRPC}.button2`, { label: '', url: '' }).label != '' &&
			this.settings.get(`${selectedRPC}.button2`, { label: '', url: '' }).url != ''
		)
			buttons.push(this.settings.get(`${selectedRPC}.button2`));
		if (buttons[0]) rp.buttons = buttons;
		return rp;
	}

	startPlugin() {
		this.convertSettingsForConfigs();
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
		const selectedRPC = this.settings.get('selected', 'rpc1');
		setTimeout(() => {
			SET_ACTIVITY.handler({
				socket: {
					id: 100,
					application: {
						id: this.settings.get(`${selectedRPC}.client_id`, '711416957718757418'),
						name: this.settings.get(`${selectedRPC}.name`, 'Custom RPC'),
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
					name: this.settings.get('name', 'Custom RPC'),
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
