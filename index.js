const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const Settings = require('./Settings');
const path = require('path');

const { SET_ACTIVITY } = getModule(['SET_ACTIVITY'], false);
const defaults = {
	rpc1: {
		show_time: true,
		client_id: '892203377503658064',
		name: 'Custom RPC',
		state: 'Powercord client',
		details: 'Browsing Discord',
		large_image: 'powercord',
		small_image: 'powercord',
	},
	rpc2: {
		show_time: true,
		client_id: '892203377503658064',
		name: 'Custom RPC',
		state: 'Powercord client',
		details: 'Browsing Discord',
		large_image: 'powercord',
		small_image: 'powercord',
	},
	rpc3: {
		show_time: true,
		client_id: '892203377503658064',
		name: 'Custom RPC',
		state: 'Powercord client',
		details: 'Browsing Discord',
		large_image: 'powercord',
		small_image: 'powercord',
	},

	selected: 'rpc1',
};

module.exports = class customRPC extends Plugin {
	reloadRPC() {
		const selectedRPC = this.settings.get('selected', 'rpc1');
		SET_ACTIVITY.handler({
			isSocketConnected: () => true,
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
				activity: this.settings.get('disabled', false) ? undefined : this.game(),
			},
		}).catch(err => {
			if (err.body.message === 'Unknown Application') {
				powercord.api.notices.sendToast(`custom-rpc-invaildId-${Math.floor(Math.random() * 200)}`, {
					header: 'Invaild Client Id',
					timeout: 3000,
				});
			}
		});
	}

	convertSettingsForConfigs() {
		if (this.settings.get('rpc1', undefined)) return;
		const settings = powercord.api.settings._fluxProps(__dirname.split(path.sep).pop()).settings;
		if (Object.entries(settings).length === 0) {
			this.log('setting defaults...');
			this.settings.set('rpc1', defaults);
			this.settings.set('rpc2', defaults);
			this.settings.set('rpc3', defaults);
			powercord.api.notices.sendToast('custom-rpc-1', {
				header: 'Settings conversion done!',
				content: `Please reload so you can start using saved configs for custom-rpc!`,
			});
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
		powercord.api.notices.sendToast('custom-rpc-2', {
			header: 'Settings conversion done!',
			content: `Please reload so you can start using saved configs for custom-rpc!`,
		});
	}

	game() {
		const selectedRPC = this.settings.get('selected', 'rpc1');
		let rp = {
			details: this.settings.get(`${selectedRPC}.details`, defaults.details) || undefined,
			state: this.settings.get(`${selectedRPC}.state`, defaults.state) || undefined,
			timestamps: this.settings.get(`${selectedRPC}.show_time`, defaults.show_time)
				? {
						start: this.settings.get(`${selectedRPC}.start_time`, undefined)
							? new Date(new Date().getTime() - this.settings.get(`${selectedRPC}.start_time`) * 60000).getTime()
							: Date.now(),
				  }
				: undefined,
			assets: {
				large_image: this.settings.get(`${selectedRPC}.large_image`, defaults.large_image),
				small_image: this.settings.get(`${selectedRPC}.small_image`, defaults.small_image),
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

		setTimeout(() => this.reloadRPC(), 2000);
	}

	pluginWillUnload() {
		SET_ACTIVITY.handler({
			isSocketConnected: () => true,
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
