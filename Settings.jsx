const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { TextInput, SwitchItem, Category, SelectInput } = require('powercord/components/settings');
const path = require('path');

const configs = [
	{
		label: 'RPC 1',
		value: 'rpc1',
	},
	{
		label: 'RPC 2',
		value: 'rpc2',
	},
	{
		label: 'RPC 3',
		value: 'rpc3',
	},
];
module.exports = class RPCSettings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			category0Opened: false,
			category1Opened: false,
			button1Def: { label: 'powercord.dev', url: 'https://powercord.dev' },
			button2Def: { label: '', url: '' },
			selectedRPC: this.props.getSetting('selected', 'rpc1'),
		};
	}

	render() {
		const { getSetting, updateSetting } = this.props;
		const { getCurrentUser } = getModule(['getCurrentUser'], false);
		const UserPopout = getModuleByDisplayName('UserProfile', false);
		const rpc = getSetting(this.state.selectedRPC);
		console.log(rpc, this.state.selectedRPC);
		return (
			<div>
				<SelectInput
					searchable={false}
					value={getSetting('selected', 'rpc1')}
					onChange={val => {
						updateSetting('selected', val.value);
						this.setState({ selectedRPC: val.value });
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
					options={configs.map(({ label, value }) => ({
						label,
						value,
					}))}
				>
					RPC CONFIGS
				</SelectInput>
				<SwitchItem
					value={rpc.show_time ?? true}
					onChange={() => {
						rpc.show_time = !rpc.show_time;
						updateSetting(this.state.selectedRPC, rpc);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Show Time
				</SwitchItem>
				<TextInput
					value={rpc.client_id}
					required={true}
					onChange={val => {
						console.log('changed!');
						rpc.client_id = val;
						updateSetting(this.state.selectedRPC, rpc);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Client ID
				</TextInput>
				<TextInput
					value={rpc.start_time ?? ''}
					onChange={val => {
						rpc.start_time = val;
						updateSetting(this.state.selectedRPC, rpc);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Custom Start Time In Minutes
				</TextInput>
				<TextInput
					value={rpc.name}
					onChange={val => {
						rpc.name = val;
						updateSetting(this.state.selectedRPC, rpc);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Name
				</TextInput>
				<TextInput
					value={rpc.details}
					onChange={val => {
						rpc.details = val;
						updateSetting(this.state.selectedRPC, rpc);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Details
				</TextInput>
				<TextInput
					value={rpc.state}
					onChange={val => {
						rpc.state = val;
						updateSetting(this.state.selectedRPC, rpc);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					State
				</TextInput>
				<Category
					name="Images"
					description={'Manage large and small image appearance'}
					opened={this.state.category0Opened}
					onChange={() => {
						this.setState({ category1Opened: false });
						this.setState({ category0Opened: !this.state.category0Opened });
					}}
				>
					<TextInput
						note="this will be the file name"
						value={rpc.large_image}
						onChange={val => {
							rpc.large_image = val;
							updateSetting(this.state.selectedRPC, rpc);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Large Image
					</TextInput>
					<TextInput
						note="This will show text when large image is hovered"
						value={rpc.large_text ?? ''}
						onChange={val => {
							rpc.large_text = val;
							updateSetting(this.state.selectedRPC, rpc);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Large Text
					</TextInput>
					<TextInput
						note="this will be the file name"
						value={rpc.small_image}
						onChange={val => {
							rpc.small_image = val;
							updateSetting(this.state.selectedRPC, rpc);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Small Image
					</TextInput>
					<TextInput
						note="This will show text when small image is hovered"
						value={rpc.small_text ?? ''}
						onChange={val => {
							rpc.small_text = val;
							updateSetting(this.state.selectedRPC, rpc);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Small Text
					</TextInput>
				</Category>
				<Category
					name="Buttons"
					description={'Manage buttons'}
					opened={this.state.category1Opened}
					onChange={() => {
						this.setState({ category0Opened: false });
						this.setState({ category1Opened: !this.state.category1Opened });
					}}
				>
					<TextInput
						value={rpc.button1.label}
						onChange={val => {
							rpc.button1.label = val;
							updateSetting(this.state.selectedRPC, rpc);
							if (rpc.button1.url != '') {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 1 Text
					</TextInput>
					<TextInput
						value={rpc.button1.url}
						onChange={val => {
							rpc.button1.url = val;
							updateSetting(this.state.selectedRPC, rpc);
							if (rpc.button1.label != '') {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 1 Url
					</TextInput>
					<TextInput
						value={rpc.button2?.label ?? ''}
						onChange={val => {
							if (!rpc.button2) rpc.button2 = {};
							rpc.button2.label = val;
							updateSetting(this.state.selectedRPC, rpc);
							if (rpc.button2.url != '') {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 2 Text
					</TextInput>
					<TextInput
						value={rpc.button2?.url ?? ''}
						onChange={val => {
							if (!rpc.button2) rpc.button2 = {};
							rpc.button2.url = val;
							updateSetting(this.state.selectedRPC, rpc);
							if (rpc.button2.label != '') {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 2 Url
					</TextInput>
				</Category>
				<p className="h5-18_1nd">Your popout:</p>
				<UserPopout user={getCurrentUser()} />
				<br />
				<a
					onClick={() => {
						require('electron').shell.openExternal('https://www.reddit.com/r/discordapp/comments/a2c2un/how_to_setup_a_custom_discord_rich_presence_for/');
					}}
				>
					Help for custom RPC but do step 3 with this plugin
				</a>
			</div>
		);
	}
};
