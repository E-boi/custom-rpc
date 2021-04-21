const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { TextInput, SwitchItem, Category } = require('powercord/components/settings');
const path = require('path');

module.exports = class RPCSettings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { category0Opened: false, category1Opened: false, button1Def: {label: "powercord.dev", url: "https://powercord.dev"}, button2Def: {label: "", url: ""}};
	}

	render() {
		const { getSetting, toggleSetting, updateSetting } = this.props;
		const { getCurrentUser } = getModule(['getCurrentUser'], false);
		const UserPopout = getModuleByDisplayName('UserProfile', false);
		return (
			<div>
				<SwitchItem
					value={getSetting('show_time', true)}
					onChange={() => {
						toggleSetting('show_time');
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Show Time
				</SwitchItem>
				<TextInput
					defaultValue={getSetting('client_id', '711416957718757418')}
					required={true}
					onChange={val => {
						updateSetting('client_id', val);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Client ID
				</TextInput>
				<TextInput
					defaultValue={getSetting('start_time', '')}
					onChange={val => {
						      updateSetting('start_time', val);
						      powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC()
				     	}}
				>
					Custom Time
				</TextInput>
				<TextInput
					defaultValue={getSetting('name', 'Custom RPC')}
					onChange={val => {
						updateSetting('name', val);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Name
				</TextInput>
				<TextInput
					defaultValue={getSetting('details', 'Browsing Discord')}
					onChange={val => {
						updateSetting('details', val);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Details
				</TextInput>
				<TextInput
					defaultValue={getSetting('state', 'Powercord Client')}
					onChange={val => {
						updateSetting('state', val);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					State
				</TextInput>
				<Category
                	name='Images'
                	description={'Manage large and small image appearance'}
                	opened={this.state.category0Opened}
            		onChange={() => {
						this.setState({ category1Opened: false });
						this.setState({ category0Opened: !this.state.category0Opened })
					}}
                >
					<TextInput
						note="this will be the file name"
						defaultValue={getSetting('large_image', 'powercord')}
						onChange={val => {
							updateSetting('large_image', val);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Large Image
					</TextInput>
					<TextInput
						note="This will show text when large image is hovered"
						defaultValue={getSetting('large_text', '')}
						onChange={val => {
							updateSetting('large_text', val);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Large Text
					</TextInput>
					<TextInput
						note="this will be the file name"
						defaultValue={getSetting('small_image', 'powercord')}
						onChange={val => {
							updateSetting('small_image', val);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Small Image
					</TextInput>
					<TextInput
						note="This will show text when small image is hovered"
						defaultValue={getSetting('small_text', '')}
						onChange={val => {
							updateSetting('small_text', val);
							powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
						}}
					>
						Small Text
					</TextInput>
				</Category>
				<Category
                  name='Buttons'
                  description={'Manage buttons'}
                  opened={this.state.category1Opened}
                  onChange={() => {
					  this.setState({ category0Opened: false });
					  this.setState({ category1Opened: !this.state.category1Opened });
					}}
                >
					<TextInput
						defaultValue={getSetting('button1', this.state.button1Def).label}
						onChange={val => {
							let button1 = getSetting('button1', this.state.button1Def);
							button1.label = val;
							updateSetting('button1', button1);
							if (button1.url != "") {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 1 Text
					</TextInput>
					<TextInput
						defaultValue={getSetting('button1', this.state.button1Def).url}
						onChange={val => {
							let button1 = getSetting('button1', this.state.button1Def);
							button1.url = val;
							updateSetting('button1', button1);
							if (button1.label != "") {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 1 Url
					</TextInput>
					<TextInput
						defaultValue={getSetting('button2', this.state.button2Def).label}
						onChange={val => {
							let button2 = getSetting('button2', this.state.button2Def);
							button2.label = val;
							updateSetting('button2', button2);
							if (button2.url != "") {
								powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
							}
						}}
					>
						Button 2 Text
					</TextInput>
					<TextInput
						defaultValue={getSetting('button2', this.state.button2Def).url}
						onChange={val => {
							let button2 = getSetting('button2', this.state.button2Def);
							button2.url = val;
							updateSetting('button2', button2);
							if (button2.label != "") {
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
						require('electron').shell.openExternal(
							'https://www.reddit.com/r/discordapp/comments/a2c2un/how_to_setup_a_custom_discord_rich_presence_for/'
						);
					}}
				>
					Help for custom RPC but do step 3 with this plugin
				</a>
			</div>
		);
	}
};
