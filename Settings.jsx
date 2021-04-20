const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { TextInput, SwitchItem } = require('powercord/components/settings');
const path = require('path');

module.exports = class RPCSettings extends React.PureComponent {
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
				<TextInput defaultValue={getSetting('client_id', '711416957718757418')} required={true} onChange={val => updateSetting('rpcId', val)}>
					Client ID
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
					note="This will show text when small image is hovered"
					defaultValue={getSetting('small_text', '')}
					onChange={val => {
						updateSetting('small_text', val);
						powercord.pluginManager.get(__dirname.split(path.sep).pop()).reloadRPC();
					}}
				>
					Small Text
				</TextInput>
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
